import produce from 'immer';

import { IUpdate, IDraft, IData, IChip, IQuery, IOptions } from '.';

export function newChip<T = IData>(data: T) {
  return { data, status: { type: 'IDLE' } } as IChip;
}

export function equalityCheck(chop: any, chip: any) {
  const isObject = (v: IData) => typeof v === 'object';
  const objectKeys = (o: IData) => (isObject(o) ? Object.keys(o!).sort() : []);
  const isEqual = (chop: any, chip: any) => JSON.stringify(chop) === JSON.stringify(chip);

  if (!chop) return 'update'; // update if empty
  // check if objects have same keys
  if (isEqual(objectKeys(chop), objectKeys(chip))) {
    // check if objects are equal
    if (isEqual(chop, chip)) return 'skip';
    return 'update';
  } else return 'warn';
}

export function chopper<T = IData>(chop: IChip, update: IUpdate<T>) {
  let updated;
  if (!chop.data) {
    if (typeof update !== 'function') updated = produce(chop.data, () => update);
    else updated = produce({}, update as IDraft);
  } else if (typeof update !== 'function') updated = produce(chop.data, () => update);
  else updated = produce(chop.data, update as IDraft);
  return { ...chop, data: updated } as IChip;
}

export function mockAsync<T = IData>(data: T, timeout?: number) {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (data !== undefined) resolve(data);
      else reject({ message: 'Chipper: mockAsync() failed' });
    }, timeout || 0);
  });
}

export async function setAsync<T = IData>(
  Query: IQuery,
  update: Promise<T | void>,
  options?: IOptions<T>,
) {
  function initAsync() {
    Query.set({ ...Query.get(), status: { type: 'LOADING' } });
    return options?.onInit && options.onInit();
  }
  async function runAsync() {
    try {
      return await update;
    } catch (error) {
      return error;
    }
  }
  function failAsync(message: string) {
    Query.set({ ...Query.get(), status: { type: 'ERROR', message } });
    return options?.onError && options.onError(message);
  }
  function finishAsync(resp: T) {
    const data = options?.wrapResp ? options.wrapResp(resp) : resp;
    Query.set({ data, status: { type: 'SUCCESS' } });
    return options?.onSuccess && options.onSuccess(data);
  }

  async function* createAsyncGenerator() {
    yield initAsync();
    const resp = await runAsync();
    yield await resp;
    if (resp instanceof Error) return failAsync(resp.message);
    else return finishAsync(resp);
  }

  const AsyncGenerator = createAsyncGenerator();
  AsyncGenerator.next();
  await AsyncGenerator.next();
  AsyncGenerator.next();
}
