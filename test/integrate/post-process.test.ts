/**
 * @author WMXPY
 * @namespace Fetch
 * @description Post Process
 * @package Integrate Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Fetch, METHOD } from "../../src";
import { exampleResponse } from "../mock/example";
import { MockFetch } from "../mock/mock-fetch";

describe('Given a (Post-Process) scenario', (): void => {

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    (global.window as any) = {};
    const chance: Chance.Chance = new Chance('fetch-post-process');

    it('should be able to add value to body body with post process produce function', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const bodyKey: string = chance.string();
        const bodyValue: string = chance.string();

        const clazz = Fetch.get.withJson(url, mockFetch.getFetch());
        clazz.addProducePostProcessFunction((draft) => {
            draft[bodyKey] = bodyValue;
        });

        const res = await clazz.fetchJson();

        expect(res).to.be.deep.equal({
            ...exampleResponse,
            [bodyKey]: bodyValue,
        });
        expect(mockFetch.url).to.be.equal(url);
        expect(mockFetch.init).to.be.deep.equal({
            body: undefined,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: METHOD.GET,
            mode: "cors",
            signal: undefined,
        });
    });

    it('should be able to edit value to body body with post process produce function', async (): Promise<void> => {

        const url: string = chance.string();
        const mockFetch: MockFetch = MockFetch.create(exampleResponse);

        const bodyValue: string = chance.string();

        const clazz = Fetch.get.withJson(url, mockFetch.getFetch());
        clazz.addProducePostProcessFunction((draft) => {
            draft.foo = bodyValue;
        });

        const res = await clazz.fetchJson();

        expect(res).to.be.deep.equal({
            foo: bodyValue,
        });
        expect(mockFetch.url).to.be.equal(url);
        expect(mockFetch.init).to.be.deep.equal({
            body: undefined,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: METHOD.GET,
            mode: "cors",
            signal: undefined,
        });
    });
});
