/**
 * @author WMXPY
 * @namespace Fetch
 * @description Base
 */

import { FetchFunction, METHOD } from "./declare";

export class FetchBase {

    protected readonly _url: string;
    protected readonly _method: METHOD;

    protected readonly _fetch: FetchFunction;

    protected _mode: RequestMode;
    protected _body: string | undefined;
    protected _headers: Record<string, string>;

    protected constructor(url: string, method: METHOD, fetchFunction: FetchFunction = fetch) {

        this._url = url;
        this._method = method;
        this._fetch = fetchFunction;

        this._body = undefined;
        this._headers = {};
        this._mode = "cors";
    }

    public setMode(mode: RequestMode): this {

        this._mode = mode;
        return this;
    }

    public bearer(token: string): this {

        this._headers.Authorization = 'bearer ' + token;
        return this;
    }
}
