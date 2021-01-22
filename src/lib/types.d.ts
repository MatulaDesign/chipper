type IData = Record<string, unknown> | string;
type IQue<T = IData> = { key: string; update: IUpdater<T> };
type IQueue<T = IData> = [string, T][];
type IUpdater<T = IData> = IChip<T> | ((chip: IChip<T>) => IChip<T>);
interface IOptions<T = any> {
  timeout?: number;
  onInit?: () => void;
  onSuccess?: (resp: T) => void;
  onError?: (error: IError) => void;
  wrapResp?: (...args: any[]) => T;
}
interface IChip<T = IData> {
  data: T | undefined;
  status: IStatus;
}
interface IQuery {
  cut: (k?: string) => boolean;
  get: (k?: string) => IChip<T>;
  set: <T>(chip: T | IChip<T>, k?: string) => void;
}
