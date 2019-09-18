/**
 * @author WMXPY
 * @namespace Fetch
 * @description Declare
 */

export type BaseType = string | number | boolean;

export type HeaderPair = {

    readonly key: string;
    readonly value: string;
};

export enum METHOD {

    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    OPTION = "OPTION",
}

export type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface IFetch {

    param(key: string, value: any): IFetch;
    append(query: Record<string, string>): IFetch;
    query(query: Record<string, string>): IFetch;
    add(key: string, value: any): IFetch;
    combine(body: Record<string, any>): IFetch;
    bearer(token: string): IFetch;
    body(body: Record<string, any>): IFetch;
    getBody(): Record<string, any> | undefined;
    fetch<T>(): Promise<T>;
    migrate(body: Record<string, any>): IFetch;
    header(name: string, value: any): IFetch;
    setMode(mode: RequestMode): IFetch;
    abort(): IFetch;
    getAbortController(): AbortController | undefined;
    debug(environment?: string, logFunction?: (...elements: any[]) => void): IFetch;
    debugRequest(environment?: string, logFunction?: (...elements: any[]) => void): IFetch;
    debugResponse(environment?: string, logFunction?: (...elements: any[]) => void): IFetch;
    setEnvironment(environment: string): IFetch;
    enableFallback(): IFetch;
    disableFallback(): IFetch;
    setLogFunction(logFunction: (...elements: any[]) => void): IFetch;
}
