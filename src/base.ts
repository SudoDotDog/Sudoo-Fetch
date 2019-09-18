/**
 * @author WMXPY
 * @namespace Fetch
 * @description Base
 */

import { FetchFunction, METHOD } from "./declare";
import { GlobalHeaderManager } from "./global";
import { buildQuery, parseXHeader } from "./util";

export type LogFunction = (...elements: any[]) => any;

export class FetchBase {

    protected readonly _url: string;
    protected readonly _method: METHOD;

    protected readonly _fetch: FetchFunction;

    protected _mode: RequestMode = "cors";
    protected _body: Record<string, any> = {};
    protected _query: Record<string, any> = {};
    protected _headers: Record<string, string> = {};
    protected readonly _globalHeaders: Record<string, string>;
    protected readonly _abortController: AbortController | undefined;

    protected _debugRequest: boolean = false;
    protected _debugResponse: boolean = false;
    protected _environment: string | null = null;
    protected _logFunction: LogFunction | null = null;

    protected _fallback: boolean = false;

    protected constructor(
        url: string,
        method: METHOD,
        fetchFunction: FetchFunction,
        signal: AbortController | undefined,
        globalHeaders: Record<string, string>,
    ) {

        this._url = url;
        this._method = method;
        this._fetch = fetchFunction;
        this._abortController = signal;

        this._globalHeaders = globalHeaders;
    }

    public mergeHeaders(): Record<string, string> {

        return {
            ...this._headers,
            ...GlobalHeaderManager.instance.headers,
        };
    }

    public param(key: string, value: string): this {

        this._query = {
            ...this._query,
            [key]: value,
        };
        return this;
    }

    public append(query: Record<string, string>): this {

        const keys: string[] = Object.keys(query);

        for (const key of keys) {
            this.param(key, query[key]);
        }
        return this;
    }

    public query(query: Record<string, string>): this {

        this._query = query;
        return this;
    }

    public add(key: string, value: any): this {

        if (this._method === METHOD.GET) {
            throw new Error('Request with GET/HEAD method cannot have body.');
        }

        this._body = {

            ...this._body,
            [key]: value,
        };
        return this;
    }

    public addIfExist(key: string, value: any): this {

        if (value === undefined || value === null) {
            return this;
        }

        return this.add(key, value);
    }

    public combine(body: Record<string, any>): this {

        const keys: string[] = Object.keys(body);

        for (const key of keys) {
            this.add(key, body[key]);
        }
        return this;
    }

    public combineIfExist(body: Record<string, any>): this {

        const keys: string[] = Object.keys(body);

        for (const key of keys) {
            this.addIfExist(key, body[key]);
        }
        return this;
    }

    public basic(token: string): this {

        return this.authorization('basic ' + token);
    }

    public bearer(token: string): this {

        return this.authorization('bearer ' + token);
    }

    public body(body: Record<string, any>): this {

        if (this._method === METHOD.GET) {
            throw new Error('Request with GET/HEAD method cannot have body.');
        }

        this._body = body;
        return this;
    }

    public migrate(body: Record<string, any>): this {

        this._body = {

            ...this._body,
            ...body,
        };
        return this;
    }

    public authorization(value: string): this {

        return this.header('Authorization', value);
    }

    public header(name: string, value: string): this {

        this._headers = {

            ...this._headers,
            [name]: value,
        };
        return this;
    }

    public headerIfExist(name: string, value: string | null | undefined): this {

        if (value === undefined || value === null) {
            return this;
        }

        return this.header(name, value);
    }

    public xHeader(name: string, value: string): this {

        this._headers = {

            ...this._headers,
            [parseXHeader(name)]: value,
        };
        return this;
    }

    public setMode(mode: RequestMode): this {

        this._mode = mode;
        return this;
    }

    public debug(
        environment: string = (process as any).env.NODE_ENV,
        logFunction: (...elements: any[]) => void = console.log,
    ): this {

        this._debugRequest = true;
        this._debugResponse = true;
        this._environment = environment;
        this._logFunction = logFunction;

        return this;
    }

    public debugRequest(
        environment: string = (process as any).env.NODE_ENV,
        logFunction: (...elements: any[]) => void = console.log,
    ): this {

        this._debugRequest = true;
        this._environment = environment;
        this._logFunction = logFunction;

        return this;
    }

    public debugResponse(
        environment: string = (process as any).env.NODE_ENV,
        logFunction: (...elements: any[]) => void = console.log,
    ): this {

        this._debugResponse = true;
        this._environment = environment;
        this._logFunction = logFunction;

        return this;
    }

    public setEnvironment(environment: string): this {

        this._environment = environment;
        return this;
    }

    public setLogFunction(logFunction: (...elements: any[]) => void): this {

        this._logFunction = logFunction;
        return this;
    }

    public enableFallback(): this {

        this._fallback = true;
        return this;
    }

    public disableFallback(): this {

        this._fallback = false;
        return this;
    }

    public getBody(): Record<string, any> | undefined {

        if (this._method === METHOD.GET) {
            return undefined;
        }

        return this._body;
    }

    public abort(): this {

        if (this._abortController) {
            this._abortController.abort();
        }
        return this;
    }

    public getAbortController(): AbortController | undefined {

        return this._abortController;
    }

    protected hasQuery(): boolean {

        return Object.keys(this._query).length > 0;
    }

    protected buildQuery(): string {

        return buildQuery(this._query);
    }

    protected buildUrl(): string {

        if (this.hasQuery()) {

            return this._url + '?' + this.buildQuery();
        }
        return this._url;
    }

    protected getAbortSignal(): AbortSignal | undefined {

        if (this._abortController) {
            return this._abortController.signal;
        }
        return undefined;
    }

    protected logRequestMessage(): void {

        if (
            this._debugRequest
            && this._environment === 'development'
            && this._logFunction
            && typeof this._logFunction === 'function'
        ) {

            this._logFunction('FETCH-DEBUG-REQUEST', {
                Url: this._url,
                Method: this._method,
                Mode: this._mode,
                Header: this._headers,
                Body: this._body,
            });
        }
    }

    protected logResponseMessage(...elements: any[]): void {

        if (
            this._debugResponse
            && this._environment === 'development'
            && this._logFunction
            && typeof this._logFunction === 'function'
        ) {

            this._logFunction('FETCH-DEBUG-RESPONSE', ...elements);
        }
    }
}
