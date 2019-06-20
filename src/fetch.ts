/**
 * @author WMXPY
 * @namespace Fetch
 * @description Fetch
 */

import { FetchFunction, IFetch, METHOD } from "./declare";
import { FetchFromData } from "./form-data";
import { FetchJson } from "./json";
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

        return this._globalHeaders;
    }

    public static setGlobalHeader(name: string, value: string): typeof Fetch {

        this._globalHeaders = {

            ...this._globalHeaders,
            [name]: value,
        };
        return Fetch;
    }

    public static setGlobalXHeader(name: string, value: string): typeof Fetch {

        this._globalHeaders = {

            ...this._globalHeaders,
            [parseXHeader(name)]: value,
        };
        return Fetch;
    }

    public static getGlobalHeader(name: string): string | null {

        if (this._globalHeaders[name]) {

            return this._globalHeaders[name];
        }
        return null;
    }

    public static getGlobalXHeader(name: string): string | null {

        const header: string = parseXHeader(name);
        if (this._globalHeaders[header]) {

            return this._globalHeaders[header];
        }
        return null;
    }

    public static removeGlobalHeader(name: string): typeof Fetch {

        if (this._globalHeaders[name]) {

            this._globalHeaders[name] = undefined as any;
        }
        return this;
    }

    public static removeGlobalXHeader(name: string): typeof Fetch {

        const header: string = parseXHeader(name);
        if (this._globalHeaders[header]) {

            this._globalHeaders[header] = undefined as any;
        }
        return this;
    }

    public static removeAllGlobalHeaders(): typeof Fetch {

        this._globalHeaders = {};
        return this;
    }

    private static _globalHeaders: Record<string, string> = {};

    private readonly _method: METHOD;

    private constructor(method: METHOD) {

        this._method = method;

        if (!Boolean(window)) {
            throw new Error('[Sudoo-Fetch] This module only work with browser');
        }
    }

    public json(url: string, fetchFunction: FetchFunction = fetch.bind(window)): IFetch {

        return new FetchJson(url, this._method, fetchFunction, Fetch.globalHeaders);
    }

    public formData(url: string, fetchFunction: FetchFunction = fetch.bind(window)): IFetch {

        return new FetchFromData(url, this._method, fetchFunction, Fetch.globalHeaders);
    }
}
