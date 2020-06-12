/**
 * @author WMXPY
 * @namespace Fetch
 * @description Header
 * @package Integrate Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Fetch } from "../../src/fetch";

describe('Given a (Header) scenario', (): void => {

    (global.window as any) = {};
    const chance: Chance.Chance = new Chance('fetch-header');

    afterEach((): void => {
        Fetch.removeAllGlobalHeaders();
    });

    it('should be able to fetch', async (): Promise<void> => {

        const url: string = JSON.stringify(chance.string());
        const result: any = {};

        const mock = (input: RequestInfo, init?: RequestInit) => {
            result.input = input;
            result.init = init;

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(url),
                text: () => Promise.resolve(url),
            } as any);
        };

        const clazz = Fetch.get.json(url, mock);

        const res = await clazz.fetch();

        expect(res).to.be.equal(JSON.parse(url));
        expect(result).to.be.deep.equal({
            init: {
                body: undefined,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                method: "GET",
                mode: "cors",
                signal: undefined,
            },
            input: url,
        });
    });

    it('should be able to set global header', async (): Promise<void> => {

        const url: string = JSON.stringify(chance.string());
        const result: any = {};

        const mock = (input: RequestInfo, init?: RequestInit) => {
            result.input = input;
            result.init = init;

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(url),
                text: () => Promise.resolve(url),
            } as any);
        };

        Fetch.setGlobalXHeader('key', 'value');
        const clazz = Fetch.get.json(url, mock);

        const res = await clazz.fetch();

        expect(res).to.be.equal(JSON.parse(url));
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
                signal: undefined,
            },
            input: url,
        });
    });
});
