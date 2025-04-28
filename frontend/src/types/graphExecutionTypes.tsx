export type OpenAIChatModelRequest = {
    model: string;
    apiKey: string;
    system_prompt: string;
    prompt: string;
    images: File[];
};
export type ChatModelPrompt = {
    systemPrompt: string;
    humanPrompt: string;
    imagePrompt: File[];
    documentPrompt: string;
    documentUrls: string[];
    config: {
        doc_chunk_size?: number;
    };
};
