export { };

declare global {
    interface Window {
        electronAPI: {
            getSetting: (key: string) => Promise<any>;
            setSetting: (key: string, value: any) => Promise<any>;
            getAllSettings: () => Promise<any>;

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

        };
    }
}