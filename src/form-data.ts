/**
 * @author WMXPY
 * @namespace Fetch
 * @description Form Data
 */

import { FetchBase } from "./base";
import { FetchFunction, IFetch, METHOD } from "./declare";
import { parseJson } from "./util";

export class FetchFromData extends FetchBase implements IFetch {

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
        };
    }

    public async fetch<T>(): Promise<T> {

        this.logRequestMessage();
        const body: Record<string, any> | undefined = this.getBody();

        const formData: FormData = new FormData();

        if (body) {

            const keys: string[] = Object.keys(body);
            keys.forEach((key: string): void => {

                const value: any = body[key];
                if (Array.isArray(value)) {

                    const appendKey: string = key.endsWith('[]')
                        ? key
                        : `${key}[]`;

                    value.forEach((each: any): void => {
                        formData.append(appendKey, each);
                    });
                    return;
                }

                formData.append(key, value);
            });
        }

        const response: Response = await this._fetch(this.buildUrl(), {

            signal: this.getAbortSignal(),
            method: this._method,
            headers: this.mergeHeaders(),
            mode: this._mode,
            body: formData,
        });

        const raw: string = await response.text();
        const data: T = parseJson(raw, this._fallback);

        if (response.ok) {

            this.logResponseMessage(data);
            return this.executePostProcessFunctions(data);
        }

        throw new Error(raw);
    }
}
