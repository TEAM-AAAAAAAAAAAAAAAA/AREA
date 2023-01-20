import { IService } from "../IService";

export class DiscordO implements IService {
    author: string;
    message: string;

    constructor(data: IService) {
        this.author = data.getSmallText();
        this.message = data.getNormalText();
    }

    getSmallText(): string {
        return this.author;
    }
    getNormalText(): string {
        return this.message;
    }
    getBigText(): string {
        return "";
    }
}
