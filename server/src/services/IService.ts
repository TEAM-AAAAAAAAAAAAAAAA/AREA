export interface IService {
    read(data: any): void;
    // receive(data: IService): void;
    push(webhookLink: string): void;
};
