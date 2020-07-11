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
        this._fetchRawFunction = this.fetchRaw.bind(this);

        this._headers = {

            ...this._headers,

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
}
