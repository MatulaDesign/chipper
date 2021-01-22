import { IUpdate, IData, IChip, IQuery, IOptions } from ".";
export declare function newChip<T = IData>(data: T): IChip<IData>;
export declare function equalityCheck(chop: any, chip: any): "update" | "skip" | "warn";
export declare function chopper<T = IData>(chop: IChip, update: IUpdate<T>): IChip<IData>;
export declare function mockAsync<T = IData>(data: T, timeout?: number): Promise<T>;
export declare function setAsync<T = IData>(Query: IQuery, update: Promise<T | void>, options?: IOptions<T>): Promise<void>;
