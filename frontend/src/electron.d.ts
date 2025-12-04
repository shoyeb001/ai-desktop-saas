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
        };
    }
}