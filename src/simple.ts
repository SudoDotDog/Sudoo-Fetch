/**
 * @author WMXPY
 * @namespace Fetch
 * @description Simple
 */

import { FetchBase } from "./base";
import { FetchFunction, IFetch, METHOD } from "./declare";

export class FetchSimple extends FetchBase implements IFetch {

    public constructor(
        url: string,
        method: METHOD,
        fetchFunction: FetchFunction,
        globalHeaders: Record<string, string>,
    ) {

        super(url, method, fetchFunction, globalHeaders);

        this._headers = {

            ...this._headers,
        };
    }

    public async fetch<T>(): Promise<T> {

        const body: Record<string, any> | undefined = this.getBody();

        const response: Response = await this._fetch(this._url, {

            method: this._method,
            headers: this.mergeHeaders(),
            mode: this._mode,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data: string = await response.text();

        if (response.ok) {
            return JSON.parse(data) as T;
        }

        throw new Error(data);
    }
}
