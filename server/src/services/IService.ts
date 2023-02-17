import { nstring } from "../types/string";

export interface IService {
    read(data: any): void;
    setOutgoing(data: nstring): void;
};
