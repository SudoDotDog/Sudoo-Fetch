/**
 * @author WMXPY
 * @namespace Fetch
 * @description Json
 */

import { FetchBase } from "../base";
import { FetchFunction, IFetch, METHOD } from "../declare";

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

    public async fetchRaw(): Promise<Response> {

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

    public async fetchJson<T extends any = any>(): Promise<T> {

        const response: Response = await this.fetchRaw();
        return this.processJsonResponse(response);
    }

    public async fetchText(): Promise<string> {

        const response: Response = await this.fetchRaw();
        return this.processTextResponse(response);
    }
}
