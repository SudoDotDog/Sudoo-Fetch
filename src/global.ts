/**
 * @author WMXPY
 * @namespace Fetch
 * @description Global
 */

import { HeaderPair } from "./declare";

export class GlobalHeaderManager {

    public static get instance(): GlobalHeaderManager {

        return this._instance;
    }

    private static readonly _instance = new GlobalHeaderManager();

    private _headers: HeaderPair[];

    private constructor() {

        this._headers = [];
    }

    public get headers(): Record<string, string> {

        return this._headers.reduce((previous: Record<string, string>, value: HeaderPair) => ({
            ...previous,
            [value.key]: value.value,
        }), {} as Record<string, string>);
    }

    public get(key: string): string | null {

        for (const header of this._headers) {
            if (header.key === key) {
                return header.value;
            }
        }
        return null;
    }

    public add(key: string, value: string): this {

        this._headers = [...this._headers, {
            key,
            value,
        }];
        return this;
    }

    public remove(key: string): this {

        this._headers = this._headers.filter((value: HeaderPair) => value.key !== key);
        return this;
    }

    public removeAll(): this {

        this._headers = [];
        return this;
    }
}
