/**
 * @author WMXPY
 * @namespace Fetch
 * @description Fetch
 */

import { FetchFunction, METHOD } from "./declare";
import { FetchFromData } from "./form-data";
import { GlobalFetchManager } from "./global";
import { FetchJson } from "./json";
import { FetchSimple } from "./simple";
import { parseXHeader } from "./util";

export class Fetch {

    public static get get(): Fetch {

        return new Fetch(METHOD.GET);
    }

    public static get post(): Fetch {

        return new Fetch(METHOD.POST);
    }

    public static get put(): Fetch {

        return new Fetch(METHOD.PUT);
    }

    public static get delete(): Fetch {

        return new Fetch(METHOD.DELETE);
    }

    public static get head(): Fetch {

        return new Fetch(METHOD.HEAD);
    }

    public static get patch(): Fetch {

        return new Fetch(METHOD.PATCH);
    }

    public static get option(): Fetch {

        return new Fetch(METHOD.OPTION);
    }

    public static get globalHeaders(): Record<string, string> {

        return GlobalFetchManager.instance.headers;
    }

    public static setGlobalHeader(name: string, value: string): typeof Fetch {

        GlobalFetchManager.instance.add(name, value);
        return Fetch;
    }

    public static setGlobalXHeader(name: string, value: string): typeof Fetch {

        GlobalFetchManager.instance.add(parseXHeader(name), value);
        return Fetch;
    }

    public static getGlobalHeader(name: string): string | null {

        return GlobalFetchManager.instance.get(name);
    }

    public static getGlobalXHeader(name: string): string | null {

        const header: string = parseXHeader(name);
        return GlobalFetchManager.instance.get(header);
    }

    public static removeGlobalHeader(name: string): typeof Fetch {

        GlobalFetchManager.instance.remove(name);
        return this;
    }

    public static removeGlobalXHeader(name: string): typeof Fetch {

        const header: string = parseXHeader(name);
        GlobalFetchManager.instance.remove(header);
        return this;
    }

    public static removeAllGlobalHeaders(): typeof Fetch {

        GlobalFetchManager.instance.removeAll();
        return this;
    }

    private readonly _method: METHOD;

    private constructor(method: METHOD) {

        this._method = method;

        if (process.env.NODE_ENV !== 'test') {
            if (!Boolean(window)) {
                throw new Error('[Sudoo-Fetch] This module only work with environment with fetch');
            }
        }
    }

    public json(url: string, fetchFunction: FetchFunction = fetch.bind(window), signal?: AbortController): FetchJson {

        return new FetchJson(url,
            this._method,
            fetchFunction,
            this._getAbortController(signal),
            Fetch.globalHeaders,
        );
    }

    public simple(url: string, fetchFunction: FetchFunction = fetch.bind(window), signal?: AbortController): FetchSimple {

        return new FetchSimple(url,
            this._method,
            fetchFunction,
            this._getAbortController(signal),
            Fetch.globalHeaders,
        );
    }

    public formData(url: string, fetchFunction: FetchFunction = fetch.bind(window), signal?: AbortController): FetchFromData {

        return new FetchFromData(url,
            this._method,
            fetchFunction,
            this._getAbortController(signal),
            Fetch.globalHeaders,
        );
    }

    private _getAbortController(signal?: AbortController): AbortController | undefined {

        if (signal) {
            return signal;
        }

        if ("AbortController" in window) {
            return new AbortController();
        }

        return undefined;
    }
}
