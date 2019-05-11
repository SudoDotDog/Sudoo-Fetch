/**
 * @author WMXPY
 * @namespace Fetch
 * @description Json
 */

import { FetchBase } from "./base";
import { FetchFunction, IFetch, METHOD } from "./declare";

export class FetchJson extends FetchBase implements IFetch {

    public constructor(url: string, method: METHOD, fetchFunction: FetchFunction) {

        super(url, method, fetchFunction);

        this._headers = {

            ...this._headers,

            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
    }

    public async fetch<T>(): Promise<T> {

        const body: Record<string, any> | undefined = this.getBody();

        const response: Response = await this._fetch(this._url, {
            method: this._method,
            headers: this._headers,
            mode: this._mode,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data: T = await response.json();

        if (response.ok) {
            return data;
        }

        throw new Error(data as any as string);
    }
}
