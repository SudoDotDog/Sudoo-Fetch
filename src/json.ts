/**
 * @author WMXPY
 * @namespace Fetch
 * @description Json
 */

import { FetchBase } from "./base";
import { FetchFunction, IFetch, METHOD } from "./declare";

export class FetchJson extends FetchBase implements IFetch {

    public constructor(url: string, method: METHOD, fetch?: FetchFunction) {

        super(url, method, fetch);

        this._headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
    }

    public body(body: Record<string, any>): this {

        this._body = JSON.stringify(body);
        return this;
    }

    public async fetch<T>(): Promise<T> {

        const response: Response = await this._fetch(this._url, {
            method: this._method,
            headers: this._headers,
            mode: this._mode,
            body: this._body,
        });

        const data: T = await response.json();

        if (response.ok) {
            return data;
        }

        throw new Error(data as any as string);
    }
}
