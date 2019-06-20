/**
 * @author WMXPY
 * @namespace Fetch
 * @description Base
 */

import { FetchFunction, METHOD } from "./declare";
import { GlobalHeaderManager } from "./global";
import { parseXHeader } from "./util";

export class FetchBase {

    protected readonly _url: string;
    protected readonly _method: METHOD;

    protected readonly _fetch: FetchFunction;

    protected _mode: RequestMode = "cors";
    protected _body: Record<string, any> = {};
    protected _headers: Record<string, string> = {};
    protected readonly _globalHeaders: Record<string, string>;

    protected constructor(
        url: string,
        method: METHOD,
        fetchFunction: FetchFunction,
        globalHeaders: Record<string, string>,
    ) {

        this._url = url;
        this._method = method;
        this._fetch = fetchFunction;

        this._globalHeaders = globalHeaders;
    }

    public mergeHeaders(): Record<string, string> {

        return {
            ...this._headers,
            ...GlobalHeaderManager.instance.headers,
        };
    }

    public add(key: string, value: string): this {

        if (this._method === METHOD.GET) {
            throw new Error('Request with GET/HEAD method cannot have body.');
        }

        this._body = {

            ...this._body,
            [key]: value,
        };
        return this;
    }

    public combine(body: Record<string, any>): this {

        const keys: string[] = Object.keys(body);

        for (const key of keys) {
            this.add(key, body[key]);
        }
        return this;
    }

    public basic(token: string): this {

        this._headers.Authorization = 'basic ' + token;
        return this;
    }

    public bearer(token: string): this {

        this._headers.Authorization = 'bearer ' + token;
        return this;
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

    public header(name: string, value: string): this {

        this._headers = {

            ...this._headers,
            [name]: value,
        };
        return this;
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

    public getBody(): Record<string, any> | undefined {

        if (this._method === METHOD.GET) {
            return undefined;
        }

        return this._body;
    }
}
