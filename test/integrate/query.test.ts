/**
 * @author WMXPY
 * @namespace Fetch
 * @description Header
 * @package Integrate Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { Fetch } from "../../src";

describe('Given a (Query) scenario', (): void => {

    (global.window as any) = {};
    const chance: Chance.Chance = new Chance('fetch-query');

    it('should be able to fetch without query', async (): Promise<void> => {

        const value: string = chance.string();
        const url: string = JSON.stringify(value);
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

        expect(res).to.be.equal(value);
        expect(result.input).to.be.equal(url);
    });

    it('should be able to fetch with query', async (): Promise<void> => {

        const url: string = JSON.stringify(chance.string());
        const result: any = {};

        const key: string = chance.string();
        const value: string = chance.string();

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
        clazz.param(key, value);

        const res = await clazz.fetch();

        expect(res).to.be.equal(JSON.parse(url));
        expect(result.input).to.be.equal(`${url}?${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });

    it('should be able to fetch with longer query', async (): Promise<void> => {

        const url: string = JSON.stringify(chance.string());
        const result: any = {};

        const key: string = chance.string();
        const value: string = chance.string();

        const key2: string = chance.string();
        const value2: string = chance.string();

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
        clazz.param(key, value);
        clazz.append({
            [key2]: value2,
        });

        const res = await clazz.fetch();

        expect(res).to.be.equal(JSON.parse(url));
        expect(result.input).to.be.equal(`${url}?${encodeURIComponent(key)}=${encodeURIComponent(value)}&${encodeURIComponent(key2)}=${encodeURIComponent(value2)}`);
    });
});
