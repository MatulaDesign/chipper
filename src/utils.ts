import produce from 'immer';

import { IUpdate, IDraft, IData, IChip, IQuery, IOptions } from '.';

export function newChip<T = IData>(data: T) {
  return { data, status: { type: 'IDLE' } } as IChip;
}

// look at this magnificent example of spaghetti machine learning! ;)
export function equalityAction(chop: any, chip: any) {
  const isEqual = (chop: any, chip: any) => JSON.stringify(chop) === JSON.stringify(chip);

  if (isEqual(chop, chip)) return 'skip';
  if (chop === null && typeof chip === 'undefined') return 'warn';
  if (chop === null || typeof chop === 'undefined') return 'update';

  const isObject = (o: any) => o && typeof o === 'object';
  const areTypesEqual = (a: any, b: any) => typeof a === typeof b;

  if (!isObject(chop)) {
    if (areTypesEqual(chop, chip)) {
      if (isEqual(chop, chip)) return 'skip';
      return 'update';
    } else {
      if (chip === null) return 'update';
      return 'warn';
    }
  }

  const objectKeys = (o: any) => (isObject(o) ? Object.keys(o) : [o]);
  const chopKeys = objectKeys(chop);

  const actions = [];
  for (let key of chopKeys) {
    const chopVal = chop[key];
    const chipVal = chip[key];
    const isArray = (o: any) => Array.isArray(o);
    const areValsEqual = isEqual(chopVal, chipVal);
    const areValsKeysEqual = isEqual(objectKeys(chipVal), objectKeys(chopVal));
    const areValsArrays = isArray(chipVal) && isArray(chopVal);
    const areValsObjects = isObject(chipVal) && isObject(chopVal);

    if (areTypesEqual(chopVal, chipVal)) {
      if (!areValsEqual) {
        if (!areValsKeysEqual) {
          if (areValsArrays) actions.push('update');
          else if (isArray(chopVal) && !isArray(chipVal)) {
            if (chipVal === null) actions.push('update');
            else actions.push('warn');
          } else if (!isArray(chopVal) && isArray(chipVal)) actions.push('warn');
          else if (areValsObjects) actions.push(equalityAction(chopVal, chipVal));
          else actions.push('update');
        } else actions.push(equalityAction(chopVal, chipVal));
      } else {
        if (areTypesEqual(chopVal, chipVal)) actions.push('update');
        else actions.push('skip');
      }
    } else {
      if (chipVal === null) actions.push('update');
      else actions.push('warn');
    }
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
    console.error(message);
    return options?.onError && options.onError(message);
  }
  function finishAsync(resp: T) {
    const data = options?.wrapResp ? options.wrapResp(resp) : resp;
    const check = equalityAction(Query.get().data, data);
    if (check === 'update') {
      Query.set({ data, status: { type: 'SUCCESS' } });
      return options?.onSuccess && options.onSuccess(data);
    } else if (check === 'warn') failAsync(`Chipper: You're trying to change data shape`);
    else failAsync(`Chipper: Update was skipped due to equal datasets`);
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
