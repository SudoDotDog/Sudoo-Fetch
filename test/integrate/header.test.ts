/**
 * @author WMXPY
 * @namespace Fetch
 * @description Header
 * @package Integrate Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Fetch } from "../../src";
import { exampleResponse } from "../mock/example";
import { MockFetch } from "../mock/mock-fetch";

describe('Given a (Header) scenario', (): void => {

    (global.window as any) = {};
    const chance: Chance.Chance = new Chance('fetch-header');

    afterEach((): void => {
        Fetch.removeAllGlobalHeaders();
    });

    it('should be able to fetch with headers', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const clazz = Fetch.get.json(url, mockFetch.getFetch());

        const res = await clazz.fetch();

        expect(res).to.be.deep.equal(exampleResponse);
        expect(mockFetch.url).to.be.equal(url);
        expect(mockFetch.init).to.be.deep.equal({
            body: undefined,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "GET",
            mode: "cors",
            signal: undefined,
        });
    });

    it('should be able to set global header', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        Fetch.setGlobalXHeader('key', 'value');
        const clazz = Fetch.get.json(url, mockFetch.getFetch());

        const res = await clazz.fetch();

        expect(res).to.be.deep.equal(exampleResponse);
        expect(mockFetch.url).to.be.equal(url);
        expect(mockFetch.init).to.be.deep.equal({
            body: undefined,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-key": "value",
            },
            method: "GET",
            mode: "cors",
            signal: undefined,
        });
    });
});
