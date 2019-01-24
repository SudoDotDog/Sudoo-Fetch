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

    add(key: string, value: any): IFetch;
    bearer(token: string): IFetch;
    body(body: Record<string, any>): IFetch;
    fetch<T>(): Promise<T>;
    migrate(body: Record<string, any>): IFetch;
    header(name: string, value: any): IFetch;
    setMode(mode: RequestMode): IFetch;
}
