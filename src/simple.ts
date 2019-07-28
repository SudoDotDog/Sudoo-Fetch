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

        this.logRequestMessage();
        const body: Record<string, any> | undefined = this.getBody();

        const response: Response = await this._fetch(this._url, {

            method: this._method,
            headers: this.mergeHeaders(),
            mode: this._mode,
            body: body ? JSON.stringify(body) : undefined,
        });

        const raw: string = await response.text();
        const data: T = this._getData(raw);

        if (response.ok) {

            this.logResponseMessage(data);
            return data;
        }

        throw new Error(raw);
    }

    private _getData<T>(text: string): T {

        try {
            const parsed: T = JSON.parse(text);
            return parsed;
        } catch (err) {
            return text as any as T;
        }
    }
}
