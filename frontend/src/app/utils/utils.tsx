export function makeid(length: number = 20) {
    // let result = "";
    // const characters =
    //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    // const charactersLength = characters.length;
    // let counter = 0;
    // while (counter < length) {
    //   result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //   counter += 1;
    // }
    // return result;

    // return uuidv4();
    return crypto.randomUUID();
}

function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export const saveToLocalStorage = (key: string, item: any) => {
    typeof window !== 'undefined' &&
        localStorage.setItem(key, JSON.stringify(item));
};

export const loadFromLocalStorage = (key: string): any => {
    const rawResult =
        typeof window !== 'undefined' ? localStorage.getItem(key) : null;

    if (rawResult) {
        try {
            const processedResult = JSON.parse(rawResult);
            return processedResult;
        } catch (error) {
            return rawResult;
        }
    }
    return;
};

export const saveToSession = (key: string, item: any) => {
    // Example usecase
    // Autosave the contents of a text field,
    //  so that if the browser is refreshed, it restores
    //  the text field content so that no writing is lost.

    typeof window !== 'undefined' &&
        sessionStorage.setItem(key, JSON.stringify(item));
};
export const loadFromSession = (key: string): any => {
    const rawResult =
        typeof window !== 'undefined' ? sessionStorage.getItem(key) : null;

    if (rawResult) {
        try {
            const processedResult = JSON.parse(rawResult);
            return processedResult;
        } catch (error) {
            return rawResult;
        }
    }
    return;
};

const Utils = {
    capitalizeFirstLetter,
    makeid,
    saveToLocalStorage,
    loadFromLocalStorage,
    saveToSession,
    loadFromSession,
};

export default Utils;
