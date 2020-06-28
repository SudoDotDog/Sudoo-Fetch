/**
 * @author WMXPY
 * @namespace Fetch
 * @description Fetch
 * @package Mock
 */

import { FetchFunction } from "../../src";

export class MockFetch {

    public static create(response: any): MockFetch {

        return new MockFetch(response);
    }

    public response?: any;
    public url?: string;

    public init?: RequestInit;

    private constructor(response: any) {

        this.response = response;

        this.url = undefined;
        this.init = undefined;
    }

    public getFetch(): FetchFunction {

        const mock = (url: string, init?: RequestInit) => {

            this.url = url;
            this.init = init;

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(this.response),
                text: () => Promise.resolve(JSON.stringify(this.response)),
            } as any);
        };
        return mock as any as FetchFunction;
    }
}

