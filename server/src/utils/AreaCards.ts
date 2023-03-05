import { ustring } from "../types/string";

export function issueFormat(authorName: ustring, authorImage: ustring, repositoryName: ustring, repositoryUrl: ustring, issueId: ustring, issueTitle: ustring, issueContent: ustring, issueUrl: ustring, datetime: ustring)
{
    var card = {
        "@type": "MessageCard",
        "@context": "https://schema.org/extensions",
        "summary": "Issue " + issueId,
        "themeColor": "0078D7",
        "title": "Issue \"" + issueTitle + "\"",
        "sections": [
            {
                "activityTitle": authorName,
                "activitySubtitle": datetime?.toString(),
                "activityImage": authorImage,
                "facts": [
                    {
                        "name": "Repository:",
                        "value": repositoryName,
                    },
                    {
                        "name": "Issue #:",
                        "value": issueId
                    }
                ],
                "text": issueContent
            }
        ],
        "potentialAction": [
            {
                "@type": "OpenUri",
                "name": "View repository",
                "targets": [
                    {
                        "os": "default",
                        "uri": repositoryUrl
                    }
                ]
            },
            {
                "@type": "OpenUri",
                "name": "View issue",
                "targets": [
                    {
                        "os": "default",
                        "uri": issueUrl
                    }
                ]
            }
        ]
    }

    return card;
}