/**
 * @author WMXPY
 * @namespace Fetch
 * @description Form Data
 */

import { FetchBase } from "../base";
import { FetchFunction, IFetch, METHOD } from "../declare";

export class FetchFromData extends FetchBase implements IFetch {

    private _useFormDataKeyPolyfill: boolean;

    public constructor(
        url: string,
        method: METHOD,
        fetchFunction: FetchFunction,
        signal: AbortController | undefined,
        globalHeaders: Record<string, string>,
    ) {

        super(url, method, fetchFunction, signal, globalHeaders);
        this._fetchRawFunction = this.fetchRaw.bind(this);

        this._useFormDataKeyPolyfill = false;

        this._headers = {

            ...this._headers,
            'Accept': 'application/json',
        };
    }

    public enableFormDataKeyPolyfill(): this {

        this._useFormDataKeyPolyfill = true;
        return this;
    }

    public disableFormDataKeyPolyfill(): this {

        this._useFormDataKeyPolyfill = false;
        return this;
    }

    public async fetchRaw(): Promise<Response> {

        const headers: Record<string, string> = this.getPreProcessedHeaders();
        const body: Record<string, any> | undefined = this.getPreProcessedBody();

        const formData: FormData = new FormData();

        if (body) {

            const keys: string[] = Object.keys(body);
            keys.forEach((key: string): void => {

                const value: any = body[key];
                if (Array.isArray(value)) {

                    const appendKey: string = this._polyfillKey(key);
                    value.forEach((each: any): void => {

                        formData.append(appendKey, each);
                    });
                    return;
                }

                formData.append(key, value);
            });
        }

        const response: Response = await this._fetch(this.buildUrl(), {

            mode: this._mode,
            method: this._method,

            headers,
            body: formData,

            signal: this.getAbortSignal(),
        });

        return response;
    }

    private _polyfillKey(key: string): string {

        if (this._useFormDataKeyPolyfill) {

            if (key.endsWith('[]')) {
                return key;
            }

            return `${key}[]`;
        }

        return key;
    }
}
