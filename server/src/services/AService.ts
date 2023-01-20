import { IService } from "./IService";

export type ustring = string | undefined;

export abstract class AService implements IService {
    abstract read(data: any): void;
    abstract receive(data: AService): void;
    abstract push(): void;

    getSmallText(): ustring { return undefined; }
    getNormalText(): ustring { return undefined; }
    getBigText(): ustring { return undefined; }
    getAuthorId(): ustring { return undefined; }
    getAuthorName(): ustring { return undefined; }
}
