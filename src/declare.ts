/**
 * @author WMXPY
 * @namespace Fetch
 * @description Declare
 */

export enum METHOD {

    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    OPTION = "OPTION",
}

export type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface IFetch {

    setMode(mode: RequestMode): IFetch;
    body(body: Record<string, any>): IFetch;
    bearer(token: string): IFetch;
    fetch<T>(): Promise<T>;
}
