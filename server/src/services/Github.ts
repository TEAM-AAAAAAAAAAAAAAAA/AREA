import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";
import { Octokit } from "octokit";
import {prisma} from "../config/db";

export interface IssueList {
    issues: Issue[];
}

export interface Issue {
    number: string;
    title: string;
    author: ustring;
    body: ustring;
}

@area.Service
@area.AuthProvider('github')
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
        const prismaUserGithub = await prisma.oAuthUserData.findUnique({
            where: {
                userId_oAuthProviderName: {
                    userId: this._userId || '',
                    oAuthProviderName: "github"
                }
            }
        });
        if (!prismaUserGithub) return undefined;
        const octokit = new Octokit({ auth: prismaUserGithub.accessToken });
        const issueData = {
            owner: this._owner || '',
            repo: this._repo || '',
            title: this._title || '',
            body: this._body || ''
        };
        octokit.rest.issues.create(issueData).then((response: { data: { html_url: any; }; }) => {
            console.log("New issue created: ", response.data.html_url);
        }).catch((error: any) => {
            console.error("Error while creating new issue: ", error);
        });
    }

    @area.Action
    @area.Description("Get issues' list of a repo")
    async getIssues(): Promise<void> {
        const prismaUserGithub = await prisma.oAuthUserData.findUnique({
            where: {
                userId_oAuthProviderName: {
                    userId: this._userId || '',
                    oAuthProviderName: "github"
                }
            }
        });
        if (!prismaUserGithub) {
            console.log("Failed to load user");
            return undefined;
        }
        const octokit = new Octokit({ auth: prismaUserGithub.accessToken });
        const iterator = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
            owner: this._owner || '',
            repo: this._repo || '',
        });
        for await (const { data: issues } of iterator) {
            for (const issue of issues) {
                this._issues.issues.push({
                    number: issue.number.toString(),
                    title: issue.title,
                    author: issue.assignee?.login,
                    body: issue.body || ''
                });
            }
        }
    }

    _issues: IssueList = { issues: [] };
    _outgoing: nstring;
    _title: ustring;
    _owner: ustring;
    _repo: ustring;
    _body: ustring;
    _userId: ustring;
}