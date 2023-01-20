export type ustring = string | undefined;

export interface IService {
    read(data: any): void;
    receive(data: IService): void;
    push(): void;
};
