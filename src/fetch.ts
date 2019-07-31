/**
 * @author WMXPY
 * @namespace Fetch
 * @description Fetch
 */

import { FetchFunction, IFetch, METHOD } from "./declare";
import { FetchFromData } from "./form-data";
import { GlobalHeaderManager } from "./global";
import { FetchJson } from "./json";
import { FetchSimple } from "./simple";
import { FetchUpload } from "./upload";
import { parseXHeader } from "./util";

export class Fetch {

    public static get get() {

        return new Fetch(METHOD.GET);
    }

    public static get post() {

        return new Fetch(METHOD.POST);
    }

    public static get put() {

        return new Fetch(METHOD.PUT);
    }

    public static get delete() {

        return new Fetch(METHOD.DELETE);
    }

    public static get option() {

        return new Fetch(METHOD.OPTION);
    }

    public static get globalHeaders(): Record<string, string> {

        return GlobalHeaderManager.instance.headers;
    }

    public static setGlobalHeader(name: string, value: string): typeof Fetch {

        GlobalHeaderManager.instance.add(name, value);
        return Fetch;
    }

    public static setGlobalXHeader(name: string, value: string): typeof Fetch {

        GlobalHeaderManager.instance.add(parseXHeader(name), value);
        return Fetch;
    }

    public static getGlobalHeader(name: string): string | null {

        return GlobalHeaderManager.instance.get(name);
    }

    public static getGlobalXHeader(name: string): string | null {

        const header: string = parseXHeader(name);
        return GlobalHeaderManager.instance.get(header);
    }

    public static removeGlobalHeader(name: string): typeof Fetch {

        GlobalHeaderManager.instance.remove(name);
        return this;
    }

    public static removeGlobalXHeader(name: string): typeof Fetch {

        const header: string = parseXHeader(name);
        GlobalHeaderManager.instance.remove(header);
        return this;
    }

    public static removeAllGlobalHeaders(): typeof Fetch {

        GlobalHeaderManager.instance.removeAll();
        return this;
    }

    private readonly _method: METHOD;

    private constructor(method: METHOD) {

        this._method = method;

        if (process.env.NODE_ENV !== 'test') {
            if (!Boolean(window)) {
                throw new Error('[Sudoo-Fetch] This module only work with browser');
            }
        }
    }

    public json(url: string, fetchFunction: FetchFunction = fetch.bind(window), signal?: AbortController): IFetch {

        return new FetchJson(url, this._method, fetchFunction, this._getAbortController(signal), Fetch.globalHeaders);
    }

    public simple(url: string, fetchFunction: FetchFunction = fetch.bind(window), signal?: AbortController): IFetch {

        return new FetchSimple(url, this._method, fetchFunction, this._getAbortController(signal), Fetch.globalHeaders);
    }

    public upload(url: string, fetchFunction: FetchFunction = fetch.bind(window), signal?: AbortController): IFetch {

        return new FetchUpload(url, this._method, fetchFunction, this._getAbortController(signal), Fetch.globalHeaders);
    }

    public formData(url: string, fetchFunction: FetchFunction = fetch.bind(window), signal?: AbortController): IFetch {

        return new FetchFromData(url, this._method, fetchFunction, this._getAbortController(signal), Fetch.globalHeaders);
    }

    private _getAbortController(signal?: AbortController): AbortController | undefined {

        if (signal) {
            return signal;
        }

        if (AbortController) {

            return new AbortController();
        }

        return undefined;
    }
}
