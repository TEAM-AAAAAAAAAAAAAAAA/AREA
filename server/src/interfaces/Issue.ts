import { ustring } from "../types/string";

export interface IssueList {
    issues: Issue[];
}

export interface Issue {
    number: string;
    title: string;
    author: ustring;
    body: ustring;
    authorImage: ustring;
    repoLink: ustring;
    issueLink: ustring;
    createdAt: ustring;
}