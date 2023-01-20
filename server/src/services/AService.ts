export type ustring = string | undefined;

export abstract class AService {
    getSmallText(): ustring { return this._smallText; }
    getNormalText(): ustring { return this._normalText; }
    getBigText(): ustring { return this._bigText; }
    getAuthorId(): ustring { return this._authorId; }
    getAuthorName(): ustring { return this._authorName; }

    _smallText: ustring = undefined;
    _normalText: ustring = undefined;
    _bigText: ustring = undefined;
    _authorId: ustring = undefined;
    _authorName: ustring = undefined;
}
