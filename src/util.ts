/**
 * @author WMXPY
 * @namespace Fetch
 * @description Util
 */

export const parseXHeader = (name: string): string => {

    return 'x-' + name.toLowerCase();
};