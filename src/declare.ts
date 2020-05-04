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
    HEAD = "HEAD",
    PATCH = "PATCH",
    OPTION = "OPTION",
}

export type PostProcessFunction<T = any> = (response: T) => T;
export type ValidateFunction<T = any> = (response: T) => boolean;

export type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface IFetch {

    setName(name: string): IFetch;
    removeName(): IFetch;
    param(key: string, value: string): IFetch;
    paramIfExist(key: string, value: string | undefined | null): IFetch;
    append(query: Record<string, string>): IFetch;
    appendIfExist(query: Record<string, string>): IFetch;
    query(query: Record<string, string>): IFetch;
    add(key: string, value: any): IFetch;
    addIfExist(key: string, value: any): IFetch;
    combine(body: Record<string, any>): IFetch;
    combineIfExist(body: Record<string, any>): IFetch;
    basic(token: string): IFetch;
    bearer(token: string): IFetch;
    digest(token: string): IFetch;
    hoba(token: string): IFetch;
    mutual(token: string): IFetch;
    body(body: Record<string, any>): IFetch;
    getBody(): Record<string, any> | undefined;
    fetch<T>(): Promise<T>;
    migrate(body: Record<string, any>): IFetch;
    migrateIfExist(body: Record<string, any>): IFetch;
    authorization(value: string): IFetch;
    header(name: string, value: string): IFetch;
    headerIfExist(name: string, value: string | undefined | null): IFetch;
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
    addValidateFunction(validateFunction: ValidateFunction): IFetch;
    addValidateFunctions(...validateFunctions: ValidateFunction[]): IFetch;
    addPostProcessFunction(postProcessFunction: PostProcessFunction): IFetch;
    addPostProcessFunctions(...postProcessFunctions: PostProcessFunction[]): IFetch;
}
