export interface DiscordListEmbed {
    "content": "AREA",
    "embeds": [DiscordListItem?],
    "attachments": []
}

export interface DiscordListItem {
    title: string;
    description: string;
    color: number;
    author: {
        name: string;
    }
    footer: {
        text: string;
    }
}

export interface DiscordList {
    list: DiscordListItem[];
}