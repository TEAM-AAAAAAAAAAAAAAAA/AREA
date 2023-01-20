import { IService } from "../IService";

export class DiscordI implements IService {
    author: string;
    message: string;

    constructor(data: any) {
        this.author = data.author;
        this.message = data.content;
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
