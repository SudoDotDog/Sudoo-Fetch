/**
 * @author WMXPY
 * @namespace Fetch
 * @description Form Data
 */

import { FetchBase } from "./base";
import { FetchFunction, IFetch, METHOD } from "./declare";

export class FetchFromData extends FetchBase implements IFetch {

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

        const formData: FormData = new FormData();

        if (body) {
            const keys: string[] = Object.keys(body);
            for (const key of keys) {
                formData.append(key, body[key]);
            }
        }

        const response: Response = await this._fetch(this._url, {
            method: this._method,
            headers: this.mergeHeaders(),
            mode: this._mode,
            body: formData,
        });

        const data: T = await response.json();

        if (response.ok) {

            this.logResponseMessage(data);
            return data;
        }

        throw new Error(data as any as string);
    }
}
