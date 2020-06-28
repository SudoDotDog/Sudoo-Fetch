/**
 * @author WMXPY
 * @namespace Fetch
 * @description Pre Process
 * @package Integrate Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Fetch, METHOD } from "../../src";
import { exampleResponse } from "../mock/example";
import { MockFetch } from "../mock/mock-fetch";

describe('Given a (Pre-Process) scenario', (): void => {

    (global.window as any) = {};
    const chance: Chance.Chance = new Chance('fetch-pre-process');

    it('should be able to produce pre process header value', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const headerKey: string = chance.string();
        const headerValue: string = chance.string();

        const clazz = Fetch.get.json(url, mockFetch.getFetch());
        clazz.addHeaderProducePreProcessFunction((draft) => {
            draft[headerKey] = headerValue;
        });

        const res = await clazz.fetch();

        expect(res).to.be.deep.equal(exampleResponse);
        expect(mockFetch.url).to.be.equal(url);
        expect(mockFetch.init).to.be.deep.equal({
            body: undefined,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                [headerKey]: headerValue,
            },
            method: METHOD.GET,
            mode: "cors",
            signal: undefined,
        });
    });

    it('should be able to produce add pre process body value', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const bodyKey: string = chance.string();
        const bodyValue: string = chance.string();

        const originalKey: string = chance.string();
        const originalValue: string = chance.string();

        const clazz = Fetch.post.json(url, mockFetch.getFetch());

        clazz.add(originalKey, originalValue);
        clazz.addBodyProducePreProcessFunction((draft) => {
            draft[bodyKey] = bodyValue;
        });

        const res = await clazz.fetch();

        expect(res).to.be.deep.equal(exampleResponse);
        expect(mockFetch.url).to.be.equal(url);
        expect(mockFetch.init).to.be.deep.equal({
            body: JSON.stringify({
                [originalKey]: originalValue,
                [bodyKey]: bodyValue,
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: METHOD.POST,
            mode: "cors",
            signal: undefined,
        });
    });

    it('should be able to produce edit pre process body value', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const bodyValue: string = chance.string();

        const originalKey: string = chance.string();
        const originalValue: string = chance.string();

        const clazz = Fetch.post.json(url, mockFetch.getFetch());

        clazz.add(originalKey, originalValue);
        clazz.addBodyProducePreProcessFunction((draft) => {
            draft[originalKey] = bodyValue;
        });

        const res = await clazz.fetch();

        expect(res).to.be.deep.equal(exampleResponse);
        expect(mockFetch.url).to.be.equal(url);
        expect(mockFetch.init).to.be.deep.equal({
            body: JSON.stringify({
                [originalKey]: bodyValue,
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: METHOD.POST,
            mode: "cors",
            signal: undefined,
        });
    });
});
