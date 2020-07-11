/**
 * @author WMXPY
 * @namespace Fetch
 * @description Declare
 */

import { DraftFunction } from "@sudoo/immutable";
import { Pattern } from "@sudoo/pattern";

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

export type HeaderPreProcessFunction<T extends Record<string, string> = any> = (header: T) => T;
export type BodyPreProcessFunction<T extends Record<string, any> = any> = (body: T) => T;

export type PostProcessFunction<T = any> = (response: T) => T;
export type ValidateFunction<T = any> = (response: T) => boolean;

export type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface IFetch {

    basic(token: string): IFetch;
    bearer(token: string): IFetch;
    digest(token: string): IFetch;
    hoba(token: string): IFetch;
    mutual(token: string): IFetch;

    setName(name: string): IFetch;
    setMode(mode: RequestMode): IFetch;
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

    body(body: Record<string, any>): IFetch;
    getBody(): Record<string, any> | undefined;
    migrate(body: Record<string, any>): IFetch;
    migrateIfExist(body: Record<string, any>): IFetch;
    authorization(value: string): IFetch;
    header(name: string, value: string): IFetch;
    headerIfExist(name: string, value: string | undefined | null): IFetch;
    getAbortController(): AbortController | undefined;

    abort(): IFetch;
    fetchRaw(accept: string): Promise<Response>;
    fetchText(): Promise<string>;
    fetchJson<T extends any = any>(): Promise<T>;

    debug(environment?: string, logFunction?: (...elements: any[]) => void): IFetch;
    debugRequest(environment?: string, logFunction?: (...elements: any[]) => void): IFetch;
    debugResponse(environment?: string, logFunction?: (...elements: any[]) => void): IFetch;
    setEnvironment(environment: string): IFetch;
    enableFallback(): IFetch;
    disableFallback(): IFetch;
    setLogFunction(logFunction: (...elements: any[]) => void): IFetch;

    // Body Pre Process
    addBodyProducePreProcessFunction<T extends Record<string, any> = any>(draftFunction: DraftFunction<T>): IFetch;
    addBodyProducePreProcessFunctions<T extends Record<string, any> = any>(...draftFunctions: Array<DraftFunction<T>>): IFetch;
    addBodyPreProcessFunction<T extends Record<string, any> = any>(bodyPreProcessFunction: BodyPreProcessFunction<T>): IFetch;
    addBodyPreProcessFunctions<T extends Record<string, any> = any>(...bodyPreProcessFunctions: Array<BodyPreProcessFunction<T>>): IFetch;
    clearBodyPreProcessFunctions(): IFetch;

    // Header Pre Process
    addHeaderProducePreProcessFunction<T extends Record<string, string> = any>(draftFunction: DraftFunction<T>): IFetch;
    addHeaderProducePreProcessFunctions<T extends Record<string, string> = any>(...draftFunctions: Array<DraftFunction<T>>): IFetch;
    addHeaderPreProcessFunction<T extends Record<string, string> = any>(headerPreProcessFunction: HeaderPreProcessFunction<T>): IFetch;
    addHeaderPreProcessFunctions<T extends Record<string, string> = any>(...headerPreProcessFunctions: Array<HeaderPreProcessFunction<T>>): IFetch;
    clearHeaderPreProcessFunctions(): IFetch;

    // Validation
    addVerifyValidation(pattern: Pattern): IFetch;
    addValidateFunction<T extends any = any>(validateFunction: ValidateFunction<T>): IFetch;
    addValidateFunctions<T extends any = any>(...validateFunctions: Array<ValidateFunction<T>>): IFetch;
    clearValidationFunctions(): IFetch;

    // Post Process
    addProducePostProcessFunction<T extends any = any>(draftFunction: DraftFunction<T>): IFetch;
    addProducePostProcessFunctions<T extends any = any>(...draftFunctions: Array<DraftFunction<T>>): IFetch;
    addPostProcessFunction<T extends any = any>(postProcessFunction: PostProcessFunction<T>): IFetch;
    addPostProcessFunctions<T extends any = any>(...postProcessFunctions: Array<PostProcessFunction<T>>): IFetch;
    clearPostProcessFunctions(): IFetch;
}
