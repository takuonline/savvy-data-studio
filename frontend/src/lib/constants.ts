const EXECUTION_STYLES = {
    idle: '',
    executing: ' border-green-500 border-2 ',
    waiting: 'border-blue-500 border-2',
    error: ' border-red-500 border-2 ',
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_PATH;

const WS_URL = `wss://${process.env.NEXT_PUBLIC_API_DOMAIN}/ws/`;

const Config = {
    WS_URL,
    API_BASE_URL,
    EXECUTION_STYLES,
};

export default Config;
