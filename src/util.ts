/**
 * @author WMXPY
 * @namespace Fetch
 * @description Util
 */

export const parseXHeader = (name: string): string => {

    return 'x-' + name.toLowerCase();
};

export const parseJson = <T>(text: string, fallback: boolean): T => {

    try {
        const parsed: T = JSON.parse(text);
        return parsed;
    } catch (err) {
        if (fallback) {
            return text as any as T;
        }
        throw err;
    }
};

export const buildQuery = (query: Record<string, string>): string => {

    const built: string = Object.keys(query)
        .map((each: string) => encodeURIComponent(each) + '=' + encodeURIComponent(query[each]))
        .join('&');

    return built;
};
