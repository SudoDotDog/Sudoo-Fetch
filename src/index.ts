/**
 * @author WMXPY
 * @namespace Fetch
 * @description Index
 */

import { FetchFunction, IFetch, METHOD } from "./declare";
import { FetchFromData } from "./form-data";
import { FetchJson } from "./json";

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

    private readonly _method: METHOD;

    private constructor(method: METHOD) {

        this._method = method;

        if (!Boolean(window)) {
            throw new Error('[Sudoo-Fetch] This module only work with browser');
        }
    }

    public json(url: string, fetchFunction: FetchFunction = fetch.bind(window)): IFetch {

        return new FetchJson(url, this._method, fetchFunction);
    }

    public formData(url: string, fetchFunction: FetchFunction = fetch.bind(window)): IFetch {

        return new FetchFromData(url, this._method, fetchFunction);
    }
}
