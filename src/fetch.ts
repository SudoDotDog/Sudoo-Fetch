/**
 * @author WMXPY
 * @namespace Fetch
 * @description Fetch
 */

import { FetchFromData } from "./content/form-data";
import { FetchJson } from "./content/json";
import { FetchFunction, METHOD } from "./declare";
import { GlobalFetchManager } from "./global";
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

        GlobalFetchManager.instance.addHeader(name, value);
        return Fetch;
    }

    public static setGlobalXHeader(name: string, value: string): typeof Fetch {

        GlobalFetchManager.instance.addHeader(parseXHeader(name), value);
        return Fetch;
    }

    public static getGlobalHeader(name: string): string | null {

        return GlobalFetchManager.instance.getHeader(name);
    }

    public static getGlobalXHeader(name: string): string | null {

        const header: string = parseXHeader(name);
        return GlobalFetchManager.instance.getHeader(header);
    }

    public static removeGlobalHeader(name: string): typeof Fetch {

        GlobalFetchManager.instance.removeHeader(name);
        return this;
    }

    public static removeGlobalXHeader(name: string): typeof Fetch {

        const header: string = parseXHeader(name);
        GlobalFetchManager.instance.removeHeader(header);
        return this;
    }

    public static removeAllGlobalHeaders(): typeof Fetch {

        GlobalFetchManager.instance.removeAllHeaders();
        return this;
    }

    public static setGlobalFetchFunction(
        fetchFunction: FetchFunction,
    ): typeof Fetch {

        GlobalFetchManager.instance.setFetchFunction(
            fetchFunction,
        );
        return this;
    }

    public static setGlobalAbortControllerConstructor(
        abortController: typeof AbortController,
    ): typeof Fetch {

        GlobalFetchManager.instance.setAbortControllerConstructor(
            abortController,
        );
        return this;
    }

    public static clearGlobalFetchFunction(): typeof Fetch {

        GlobalFetchManager.instance.clearFetchFunction();
        return this;
    }

    public static clearGlobalAbortControllerConstructor(): typeof Fetch {

        GlobalFetchManager.instance.clearAbortControllerConstructor();
        return this;
    }

    private readonly _method: METHOD;

    private constructor(method: METHOD) {

        this._method = method;
    }

    public withJson(
        url: string,
        fetchFunction?: FetchFunction,
        signal?: AbortController,
    ): FetchJson {

        const globalFetchManager: GlobalFetchManager = GlobalFetchManager.instance;

        return new FetchJson(url,
            this._method,
            globalFetchManager.getFetchFunction(fetchFunction),
            globalFetchManager.getAbortController(signal),
            Fetch.globalHeaders,
        );
    }

    public withFormData(
        url: string,
        fetchFunction?: FetchFunction,
        signal?: AbortController,
    ): FetchFromData {

        const globalFetchManager: GlobalFetchManager = GlobalFetchManager.instance;

        return new FetchFromData(url,
            this._method,
            globalFetchManager.getFetchFunction(fetchFunction),
            globalFetchManager.getAbortController(signal),
            Fetch.globalHeaders,
        );
    }
}
