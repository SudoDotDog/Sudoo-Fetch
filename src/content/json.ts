/**
 * @author WMXPY
 * @namespace Fetch
 * @description Json
 */

import { FetchBase } from "../base";
import { FetchFunction, IFetch, METHOD } from "../declare";
import { parseJson } from "../util";

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

    public async raw(): Promise<Response> {

        const headers: Record<string, string> = this.getPreProcessedHeaders();
        const body: Record<string, any> | undefined = this.getPreProcessedBody();

        const response: Response = await this._fetch(this.buildUrl(), {

            mode: this._mode,
            method: this._method,

            headers,
            body: body ? JSON.stringify(body) : undefined,

            signal: this.getAbortSignal(),
        });

        return response;
    }

    public async fetch<T>(): Promise<T> {

        this.logRequestMessage();
        const response: Response = await this.raw();

        const raw: string = await response.text();
        const data: T = parseJson(raw, this._fallback);

        if (response.ok) {

            this.logResponseMessage(data);
            return this.executePostProcessFunctions(data);
        }

        throw new Error(raw);
    }
}
