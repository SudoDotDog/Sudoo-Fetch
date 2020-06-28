/**
 * @author WMXPY
 * @namespace Fetch
 * @description Global
 */

import { HeaderPair, FetchFunction } from "./declare";

export class GlobalFetchManager {

    private static readonly _instance = new GlobalFetchManager();

    public static get instance(): GlobalFetchManager {

        return this._instance;
    }

    private _headers: HeaderPair[];

    private _fetchFunction?: FetchFunction;
    private _abortController?: typeof AbortController;

    private constructor() {

        this._headers = [];

        this._fetchFunction = undefined;
        this._abortController = undefined;
    }

    public get headers(): Record<string, string> {

        return this._headers.reduce((previous: Record<string, string>, value: HeaderPair) => ({
            ...previous,
            [value.key]: value.value,
        }), {} as Record<string, string>);
    }

    public getFetchFunction(fetchFunction?: FetchFunction): FetchFunction {

        if (fetchFunction) {
            return fetchFunction;
        }

        if (this._fetchFunction) {
            return this._fetchFunction;
        }

        if (window.fetch) {
            return window.fetch.bind(window);
        }

        throw new Error('[Sudoo-Fetch] Fetch function is required');
    }

    public getAbortController(signal?: AbortController): AbortController | undefined {

        if (signal) {
            return signal;
        }

        if (this._abortController) {

            const ReplacedAbortController = this._abortController;
            return new ReplacedAbortController();
        }

        if ("AbortController" in window) {

            return new AbortController();
        }

        return undefined;
    }

    public getHeader(key: string): string | null {

        for (const header of this._headers) {
            if (header.key === key) {
                return header.value;
            }
        }
        return null;
    }

    public addHeader(key: string, value: string): this {

        this._headers = [...this._headers, {
            key,
            value,
        }];
        return this;
    }

    public removeHeader(key: string): this {

        this._headers = this._headers.filter((value: HeaderPair) => value.key !== key);
        return this;
    }

    public removeAllHeaders(): this {

        this._headers = [];
        return this;
    }

    public setFetchFunction(
        fetchFunction: FetchFunction,
    ): this {

        this._fetchFunction = fetchFunction;
        return this;
    }

    public setAbortControllerConstructor(
        abortController: typeof AbortController,
    ): this {

        this._abortController = abortController;
        return this;
    }

    public clearFetchFunction(): this {

        this._fetchFunction = undefined;
        return this;
    }

    public clearAbortControllerConstructor(): this {

        this._abortController = undefined;
        return this;
    }
}
