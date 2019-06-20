/**
 * @author WMXPY
 * @namespace Fetch
 * @description Header
 * @package Integrate Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Fetch } from "../../src/fetch";

describe.only('Given a (Header) scenario', (): void => {

    const chance: Chance.Chance = new Chance('fetch-header');

    afterEach((): void => {
        Fetch.removeAllGlobalHeaders();
    });

    it('should be able to fetch', async (): Promise<void> => {

        const url: string = chance.string();
        const result: any = {};

        const mock = (input: RequestInfo, init?: RequestInit) => {
            result.input = input;
            result.init = init;

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(url),
            } as any);
        };

        const clazz = Fetch.get.json(url, mock);

        const res = await clazz.fetch();

        expect(res).to.be.equal(url);
        expect(result).to.be.deep.equal({
            init: {
                body: undefined,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                method: "GET",
                mode: "cors",
            },
            input: url,
        });
    });

    it('should be able to set global header', async (): Promise<void> => {

        const url: string = chance.string();
        const result: any = {};

        const mock = (input: RequestInfo, init?: RequestInit) => {
            result.input = input;
            result.init = init;

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(url),
            } as any);
        };

        Fetch.setGlobalXHeader('key', 'value');
        const clazz = Fetch.get.json(url, mock);

        const res = await clazz.fetch();

        expect(res).to.be.equal(url);
        expect(result).to.be.deep.equal({
            init: {
                body: undefined,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "x-key": "value",
                },
                method: "GET",
                mode: "cors",
            },
            input: url,
        });
    });
});
