import { Action, Description, Service } from "../area/mappings";
import { nstring, ustring } from "../types/string";
import { IService } from "./IService";

/**
 * Formatting service
 * 
 * This one's a bit special, it is not intended to push data to any webhook or api but rather to be in the middle of chained reactions to format the text.
 */
@Service
export class Formatting implements IService {
    constructor() { this._outgoing = null; }

    read(data: any): void {
    }

    setOutgoing(data: nstring): void {
        this._outgoing = data;
    }

    // @Action
    // @Description("Place 'A' character at random positions within the message and the subject")
    // async aIfy(): Promise<void>
    // {
    //     this._rawData.message = 
    // }

    @Action
    @Description("Replace all occurences of the 'a' character by 'A'")
    async aCaps(): Promise<void>
    {
        let msg: string = this._rawData.message;
        this._rawData.message = msg.replace('a', 'A');

        let sub: string = this._rawData.message;
        this._rawData.subject = sub.replace('a', 'A');
    }

    @Action
    @Description("Inserts 'feur' when 'quoi' is detected in a message")
    async feurInsert(): Promise<void>
    {
        let msg: string = this._rawData.message;
        this._rawData.message = msg.indexOf('quoi')
    }

    _rawData: any = {};
    _outgoing: nstring;
}