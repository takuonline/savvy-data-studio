export enum NodeTypeEnum {
    ChatModel = 'chatModel',
    DocumentInput = 'documentInput',
    TextInput = 'textInput',
    TextOutput = 'textOutput',
    VectorSearch = 'vectorSearch',
}

export enum ActiveSidebarPageEnum {
    Dashboard = 'dashboard',
    NodeGraph = 'nodegraph',
    Table = 'table',
    Analytics = 'analytics',
}

export enum ExecutionState {
    ready = 1,
    executing = 2,
    error = 3,
    paused = 4,
    success = 5, // Or choose another appropriate name based on the context
}
