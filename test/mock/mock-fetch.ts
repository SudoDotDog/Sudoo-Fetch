/**
 * @author WMXPY
 * @namespace Fetch
 * @description Fetch
 * @package Mock
 */

import { FetchFunction } from "../../src";

export class MockFetch {

    public static create(): MockFetch {

        return new MockFetch();
    }

    public url?: string;
    public init?: RequestInit;

    private constructor() {

        this.url = undefined;
        this.init = undefined;
    }

    public getFetch(): FetchFunction {

        const mock = (url: string, init?: RequestInit) => {

            this.url = url;
            this.init = init;

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(url),
                text: () => Promise.resolve(url),
            } as any);
        };
        return mock as any as FetchFunction;
    }
}

