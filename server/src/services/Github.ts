import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";
const { Octokit } = require("@octokit/rest");

@area.Service
export class Github implements IService {

    constructor() {
        this._outgoing = null;
    }

    read(data: any): void {
        this._title = data.bot?.issueName;
        this._owner = data.bot?.owner;
        this._repo = data.bot?.repo;
        this._body = data.bot?.body;
    }

    setOutgoing(data: nstring): void {
        this._outgoing = data;
    }
    
    @area.Action
    @area.Description("Create a new issue")
    async createIssue(): Promise<void> {
        // const octokit = new Octokit({ auth: "TOKEN" });
        // //TODO complete owner, repo, title & body
        // const issueData = {
        //     owner: "OWNER",
        //     repo: "REPO",
        //     title: "TITLE",
        //     body: "BODY>",
        // };
        //
        // octokit.issues.create(issueData).then((response: { data: { html_url: any; }; }) => {
        //     console.log("New issue created: ", response.data.html_url);
        // }).catch((error: any) => {
        //     console.error("Error while creating new issue: ", error);
        // });
    }

    @area.Action
    @area.Description("Get issues' list of a repo")
    async getIssues(): Promise<void> {
        // const octokit = new Octokit({ auth: "TOKEN" });
        // //TODO complete owner, repo, state
        // const issuesData = {
        //     owner: "OWNER",
        //     repo: "REPO",
        //     state: "STATE"
        // };
        //
        // octokit.issues.list(issuesData).then((response: { data: { html_url: any; }; }) => {
        //     console.log("This is the list of the issues of the repo: ", response.data.html_url);
        // }).catch((error: any) => {
        //     console.error("Error while trying to get issues of the repo: ", error);
        // });
    }

    _outgoing: nstring;
    _title: ustring;
    _owner: ustring;
    _repo: ustring;
    _body: ustring;
}