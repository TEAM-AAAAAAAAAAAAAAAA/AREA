export function issueFormat(authorName: string, authorImage: string, repositoryName: string, repositoryUrl: string, issueId: number, issueTitle: string, issueContent: string, datetime: string, issueUrl: string)
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
                "activitySubtitle": datetime,
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
        ]
    }

    return card;
}