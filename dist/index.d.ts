import { Draft } from 'immer';
import * as Utils from './utils';
export declare type IError = Error | string;
export declare type IStatus = {
    type: 'LOADING' | 'IDLE' | 'SUCCESS' | 'ERROR';
    message?: IError;
};
export declare type IData = Record<string, unknown> | string;
export declare type IQue<T = IData> = {
    key: string;
    update: IUpdater<T>;
};
export declare type IQueue<T = IData> = [string, T][];
export declare type IUpdater<T = IData> = IChip<T> | ((chip: IChip<T>) => IChip<T>);
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
export declare type IDraft<T = IData> = (data: Draft<T>) => void;
export declare type ISet<T = IData> = T | IDraft<T>;
export declare type IUpdate<T = IData> = ISet<T> | Promise<T | void>;
export declare type IDispatch<T = IData> = (chip: Draft<IChip<T>>) => IChip<T>;
declare class ChipperQueue {
    queue: IQue[];
    enqueue(key: string, update: IUpdater): void;
    dequeue(update: IUpdater): void;
    convey(key: string, chip: IChip): void;
}
export declare class ChipperConveyor extends ChipperQueue {
    chips: Map<string, IChip<IData>>;
    createQueue(queue: IQueue): void;
    queryQueue<T = IData>(key: string, data?: T): {
        get: (k?: string | undefined) => IChip<IData> | undefined;
        cut: (k?: string | undefined) => boolean;
        set: <R = (T & string) | (T & Record<string, unknown>)>(data: R | IChip<R>, k?: string | undefined) => void;
    };
}
declare const Chipper: ChipperConveyor;
export declare function useChipper<T = IData>(instance: ChipperConveyor, key: string, data?: T): {
    data: string | Record<string, unknown> | undefined;
    status: IStatus;
    api: {
        set: <R = (T & string) | (T & Record<string, unknown>)>(data: R | IChip<R>, k?: string | undefined) => void;
        cut: (k?: string | undefined) => boolean;
        get: (k?: string | undefined) => IChip<IData>;
    };
    set: (update: IUpdate<T>, options?: IOptions<T> | undefined) => Promise<void>;
};
export declare function useChip<T = IData>(key: string, data?: T): {
    data: string | Record<string, unknown> | undefined;
    status: IStatus;
    api: {
        set: <R = (T & string) | (T & Record<string, unknown>)>(data: R | IChip<R>, k?: string | undefined) => void;
        cut: (k?: string | undefined) => boolean;
        get: (k?: string | undefined) => IChip<IData>;
    };
    set: (update: IUpdate<T>, options?: IOptions<T> | undefined) => Promise<void>;
};
export { Utils };
export default Chipper;
