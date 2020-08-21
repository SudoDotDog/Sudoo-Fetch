/**
 * @author WMXPY
 * @namespace Fetch
 * @description Auth
 * @package Integrate Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Fetch } from "../../src";
import { exampleResponse } from "../mock/example";
import { MockFetch } from "../mock/mock-fetch";

describe('Given a (Auth) scenario', (): void => {

    (global.window as any) = {};
    const chance: Chance.Chance = new Chance('fetch-auth');

    it('should be able to fetch with basic authorization', async (): Promise<void> => {

        const url: string = chance.string();
        const basicToken: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const clazz = Fetch.get.withJson(url, mockFetch.getFetch());
        clazz.basic(basicToken);

        const res = await clazz.fetchJson();

        expect(res).to.be.deep.equal(exampleResponse);
        expect(mockFetch.url).to.be.equal(url);
        expect(mockFetch.init).to.be.deep.equal({
            body: undefined,
            headers: {
                "Accept": "application/json",
                "Authorization": `basic ${basicToken}`,
                "Content-Type": "application/json",
            },
            method: "GET",
            mode: "cors",
            signal: undefined,
        });
    });
});
