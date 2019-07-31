/**
 * @author WMXPY
 * @namespace Fetch
 * @description Json
 */

import { FetchBase } from "./base";
import { FetchFunction, IFetch, METHOD } from "./declare";
import { parseJson } from "./util";

export class FetchJson extends FetchBase implements IFetch {

    public constructor(
        url: string,
        method: METHOD,
        fetchFunction: FetchFunction,
        signal: AbortController | undefined,
        globalHeaders: Record<string, string>,
    ) {

        super(url, method, fetchFunction, signal, globalHeaders);

        this._headers = {

            ...this._headers,

            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
    }

    public async fetch<T>(): Promise<T> {

        this.logRequestMessage();
        const body: Record<string, any> | undefined = this.getBody();

        const response: Response = await this._fetch(this._url, {

            signal: this.getAbortSignal(),
            method: this._method,
            headers: this.mergeHeaders(),
            mode: this._mode,
            body: body ? JSON.stringify(body) : undefined,
        });

        const raw: string = await response.text();
        const data: T = parseJson(raw, this._fallback);

        if (response.ok) {

            this.logResponseMessage(data);
            return data;
        }

        throw new Error(raw);
    }
}
