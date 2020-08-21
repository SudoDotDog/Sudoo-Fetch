/**
 * @author WMXPY
 * @namespace Fetch
 * @description Accept
 * @package Integrate Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Fetch } from "../../src";
import { exampleResponse } from "../mock/example";
import { MockFetch } from "../mock/mock-fetch";

describe('Given a (Accept) scenario', (): void => {

    (global.window as any) = {};
    const chance: Chance.Chance = new Chance('fetch-accept');

    it('should be able to fetch for json', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const clazz = Fetch.get.withJson(url, mockFetch.getFetch());

        const res = await clazz.fetchJson();

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

    it('should be able to fetch for html', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const clazz = Fetch.get.withJson(url, mockFetch.getFetch());

        const res = await clazz.fetchHtml();

        expect(res).to.be.deep.equal(JSON.stringify(exampleResponse));
        expect(mockFetch.url).to.be.equal(url);
        expect(mockFetch.init).to.be.deep.equal({
            body: undefined,
            headers: {
                "Accept": "text/html",
                "Content-Type": "application/json",
            },
            method: "GET",
            mode: "cors",
            signal: undefined,
        });
    });

    it('should be able to fetch for text', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const clazz = Fetch.get.withJson(url, mockFetch.getFetch());

        const res = await clazz.fetchText();

        expect(res).to.be.deep.equal(JSON.stringify(exampleResponse));
        expect(mockFetch.url).to.be.equal(url);
        expect(mockFetch.init).to.be.deep.equal({
            body: undefined,
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
            mode: "cors",
            signal: undefined,
        });
    });

    it('should be able to fetch for binary', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const clazz = Fetch.get.withJson(url, mockFetch.getFetch());

        const res = await clazz.fetchBinary();

        expect(res).to.be.deep.equal(JSON.stringify(exampleResponse));
        expect(mockFetch.url).to.be.equal(url);
        expect(mockFetch.init).to.be.deep.equal({
            body: undefined,
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
            mode: "cors",
            signal: undefined,
        });
    });
});
