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

describe('Given a (Query) scenario', (): void => {

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    (global.window as any) = {};
    const chance: Chance.Chance = new Chance('fetch-query');

    it('should be able to fetch without query', async (): Promise<void> => {

        const value: string = chance.string();
        const url: string = JSON.stringify(value);
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const clazz = Fetch.get.withJson(url, mockFetch.getFetch());

        const res = await clazz.fetchJson();

        expect(res).to.be.deep.equal(exampleResponse);
        expect(mockFetch.url).to.be.equal(url);
    });

    it('should be able to fetch with query', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const key: string = chance.string();
        const value: string = chance.string();

        const clazz = Fetch.get.withJson(url, mockFetch.getFetch());
        clazz.param(key, value);

        const res = await clazz.fetchJson();
        const expectedURL: string = `${url}?${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

        expect(res).to.be.deep.equal(exampleResponse);
        expect(mockFetch.url).to.be.equal(expectedURL);
    });

    it('should be able to fetch with longer query', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const key: string = chance.string();
        const value: string = chance.string();

        const key2: string = chance.string();
        const value2: string = chance.string();

        const clazz = Fetch.get.withJson(url, mockFetch.getFetch());
        clazz.param(key, value);
        clazz.append({
            [key2]: value2,
        });

        const res = await clazz.fetchJson();
        const expectedURL: string = `${url}?${encodeURIComponent(key)}=${encodeURIComponent(value)}&${encodeURIComponent(key2)}=${encodeURIComponent(value2)}`;

        expect(res).to.be.deep.equal(exampleResponse);
        expect(mockFetch.url).to.be.equal(expectedURL);
    });
});
