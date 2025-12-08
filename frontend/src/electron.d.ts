export { };

declare global {
    interface Window {
        electronAPI: {
            generateArticle: (payload: any) => Promise<{
                title: string;
                description: string;
                article: string;
                seoKeywords: string[];
                imagePrompt: string;
            }>;
            saveArticleHistory: (payload: any) => Promise<any>;
            getHistory: () => Promise<any>;
            getHistoryItem: (id: string) => Promise<any>;
            onHistoryUpdate: (cb: (entry: any) => void) => void;
            deleteHistory: (id: string) => Promise<any>;
            onHistoryDeleted: (cb: (id: string) => void) => void;
            getSettings: () => Promise<any>;
            updateSettings: (payload: any) => Promise<any>;

            humanizeText: (payload: {
                text: string;
                tone: string;
                style: string;
            }) => Promise<{ result: string; id: string } | { error: string }>;

            getHumanizerHistory: () => Promise<
                Array<{
                    id: string;
                    input: string;
                    output: string;
                    tone: string;
                    style: string;
                    createdAt: number;
                }>
            >;

            getHumanizerOne: (id: string) => Promise<{
                id: string;
                input: string;
                output: string;
                tone: string;
                style: string;
                createdAt: number;
            }>;

            deleteHumanizer: (id: string) => Promise<{ success: boolean }>;

            onHumanizerUpdate: (cb: (entry: any) => void) => void;
            onHumanizerDelete: (cb: (id: string) => void) => void;
        };
    }
}