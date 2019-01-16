/**
 * @author WMXPY
 * @namespace Fetch
 * @description Index
 */

import { FetchBase } from "./base";
import { FetchFunction, METHOD } from "./declare";
import { FetchJson } from "./json";

export class Fetch {

    public static get get() {

        return new Fetch(METHOD.GET);
    }

    public static get post() {

        return new Fetch(METHOD.POST);
    }

    private _method: METHOD;

    private constructor(method: METHOD) {

        this._method = method;
    }

    public json(url: string, fetch?: FetchFunction): FetchBase {

        return new FetchJson(url, this._method, fetch);
    }
}
