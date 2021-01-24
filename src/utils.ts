import produce from 'immer';

import { IUpdate, IDraft, IData, IChip, IQuery, IOptions } from '.';

export function newChip<T = IData>(data: T) {
  return { data, status: { type: 'IDLE' } } as IChip;
}

export function equalityAction(chop: any, chip: any) {
  if (!chop) return 'update'; // update if empty

  const isObject = (o: any) => o && typeof o === 'object';
  const objectKeys = (o: any) => (isObject(o) ? Object.keys(o) : [o]);
  const isEqual = (chop: any, chip: any) => JSON.stringify(chop) === JSON.stringify(chip);
  const chipKeys = objectKeys(chip);
  const actions = [];

  for (let key of chipKeys) {
    const chipVal = chip[key];
    const chopVal = chop[key];
    const areValsEqual = isEqual(chopVal, chipVal);
    const areTypesEqual = typeof chipVal === typeof chopVal;
    const areValsKeysEqual = isEqual(objectKeys(chipVal), objectKeys(chopVal));
    const areValsObjects = isObject(chipVal) && isObject(chopVal);

    if (!chopVal) actions.push('update');
    else if (areTypesEqual) {
      if (!areValsEqual) {
        if (!areValsKeysEqual) {
          if (areValsObjects) actions.push('warn');
          else actions.push('update');
        } else actions.push(equalityAction(chopVal, chipVal));
      } else actions.push('skip');
    } else actions.push('warn');
  }

  if (actions.includes('warn')) return 'warn';
  if (actions.includes('update')) return 'update';
  return 'skip';
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
