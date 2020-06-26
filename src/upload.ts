/**
 * @author WMXPY
 * @namespace Fetch
 * @description Upload
 */

import { FetchBase } from "./base";
import { FetchFunction, IFetch, METHOD } from "./declare";
import { parseJson } from "./util";

export class FetchUpload extends FetchBase implements IFetch {

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

                        if (typeof each.toString === 'function') {
                            formData.append(appendKey, each.toString());
                            return;
                        }

                        if (typeof each === 'object') {
                            formData.append(appendKey, JSON.stringify(each));
                            return;
                        }

                        formData.append(appendKey, String(each));
                    });
                    return;
                }

                if (value instanceof Date) {

                    formData.append(key, value.toISOString());
                    return;
                }

                if (typeof value === 'string'
                    || typeof value === 'number'
                    || typeof value === 'boolean') {

                    formData.append(key, value.toString());
                    return;
                }

                if (value === null) {

                    formData.append(key, 'null');
                    return;
                }

                if (typeof value === 'undefined') {

                    formData.append(key, 'undefined');
                    return;
                }

                if (typeof value === 'object') {

                    formData.append(key, JSON.stringify(value));
                    return;
                }

                formData.append(key, String(body[key]));
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
