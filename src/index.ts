import { Draft } from "immer";
import * as React from "react";

import * as Utils from "./utils";

export type IError = Error | string;
export type IStatus = {
  type: "LOADING" | "IDLE" | "SUCCESS" | "ERROR";
  message?: IError;
};
export type IData = Record<string, unknown> | string;
export type IQue<T = IData> = { key: string; update: IUpdater<T> };
export type IQueue<T = IData> = [string, T][];
export type IUpdater<T = IData> = IChip<T> | ((chip: IChip<T>) => IChip<T>);
export interface IOptions<T = any> {
  timeout?: number;
  onInit?: () => void;
  onSuccess?: (resp: T) => void;
  onError?: (error: IError) => void;
  wrapResp?: (...args: any[]) => T;
}
export interface IChip<T = IData> {
  data: T | undefined;
  status: IStatus;
}
export interface IQuery {
  cut: (k?: string) => boolean;
  get: (k?: string) => IChip;
  set: <T>(chip: T | IChip<T>, k?: string) => void;
}
export type IDraft<T = IData> = (data: Draft<T>) => void;
type ISet<T = IData> = T | IDraft<T>;
export type IUpdate<T = IData> = ISet<T> | Promise<T | void>;
type IDispatch<T = IData> = (chip: Draft<IChip<T>>) => IChip<T>;

class ChipperQueue {
  queue: IQue[] = [];

  enqueue(key: string, update: IUpdater) {
    this.queue.push({ key, update });
  }
  dequeue(update: IUpdater) {
    this.queue = this.queue.filter((chip) => update !== chip.update);
  }
  convey(key: string, chip: IChip) {
    this.queue.forEach((convey) => {
      if (key === convey.key) {
        if (typeof convey.update === "function") convey.update(chip);
        else convey.update = chip;
      }
    });
  }
}

export class ChipperConveyor extends ChipperQueue {
  chips = new Map<string, IChip>();

  createQueue(queue: IQueue) {
    queue.map((que) => this.chips.set(que[0], Utils.newChip(que[1])));
  }
  queryQueue<T = IData>(key: string, data?: T) {
    if (!this.chips.has(key)) this.chips.set(key, Utils.newChip(data));
    return {
      get: (k?: string) => this.chips.get(k || key),
      cut: (k?: string) => this.chips.delete(k || key),
      set: <R = T & IData>(data: R | IChip<R>, k?: string) => {
        if (typeof data !== "function" && !(data instanceof Promise)) {
          let chip = data as IChip;
          if (chip.status === undefined) chip = Utils.newChip(data);
          this.chips.set(k || key, chip);
          this.convey(k || key, chip);
        } else console.error(`Chipper: Promises and functions passed to api.set() are ignored`);
      },
    };
  }
}

const Chipper = new ChipperConveyor();

function chipperOperator<T = IData>(chipper: ChipperConveyor, key: string, data?: T) {
  const query = chipper.queryQueue(key, data);
  const chip = query.get();
  const [, dispatch] = React.useState(chip) as [never, IDispatch];
  const isLoading = chip?.status?.type !== "LOADING";

  React.useEffect(() => {
    chipper.enqueue(key, dispatch);
    return () => {
      !isLoading && chipper.dequeue(dispatch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return query as IQuery;
}

function chipperService<T = IData>(Query: IQuery, key: string) {
  const chop = Query.get() as IChip;
  const isLoading = chop?.status?.type === "LOADING";

  async function set(update: IUpdate<T>, options?: IOptions<T>) {
    if (!isLoading) {
      const chip = Utils.chopper(chop, update);
      if (update instanceof Promise) await Utils.setAsync<T>(Query, update, options);
      else if (options?.timeout! > 0) {
        const mocked = Utils.mockAsync<T>(chip.data as T, options?.timeout);
        await Utils.setAsync<T>(Query, mocked, options);
      } else {
        const check = Utils.equalityCheck(chop.data, chip.data);
        if (check === "update") Query.set(chip);
        if (check === "warn") console.error(`Chipper: You're trying to change "${key}" data shape`);
      }
    }
  }

  const api = {
    ...Query,
    set: <R = T & IData>(data: R | IChip<R>, k?: string) => {
      const chip = Query.get(k);
      if (!chip) console.error(`Chipper: chip "${k}" doesn't exist`);
      else if (chip.data) {
        const check = Utils.equalityCheck(chip.data, data);
        if (check === "update") Query.set(data, k || key);
        if (check === "warn") {
          console.error(`Chipper: You're trying to change "${k || key}" data shape`);
        }
      } else Query.set(data, k || key);
    },
  };

  return { data: chop?.data, status: chop?.status, api, set };
}

export function useChipper<T = IData>(instance: ChipperConveyor, key: string, data?: T) {
  const Query = chipperOperator<T>(instance, key, data) as IQuery;
  return chipperService<T>(Query, key);
}

export function useChip<T = IData>(key: string, data?: T) {
  const Query = chipperOperator<T>(Chipper, key, data) as IQuery;
  return chipperService<T>(Query, key);
}

export { Utils };
export default Chipper;
