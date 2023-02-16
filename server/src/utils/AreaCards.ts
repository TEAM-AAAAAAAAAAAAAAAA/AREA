export function issueFormat(authorName: string, authorImage: string, repositoryName: string, repositoryUrl: string, issueId: number, issueTitle: string, issueContent: string, issueUrl: string, datetime: Date | undefined)
{
    var card = {
        "@type": "MessageCard",
        "@context": "https://schema.org/extensions",
        "summary": "Issue " + issueId,
        "themeColor": "0078D7",
        "title": "Issue opened: \"" + issueTitle + "\"",
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