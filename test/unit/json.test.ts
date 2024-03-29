/**
 * @author WMXPY
 * @namespace Fetch
 * @description Json
 * @package Unit Test
 */

import { Sandbox } from "@sudoo/mock";
import { expect } from "chai";
import * as Chance from "chance";
import { FetchBase, FetchJson, METHOD } from "../../src";

describe('Given a {FetchJson} class', (): void => {

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    (global.window as any) = {};
    const chance: Chance.Chance = new Chance('fetch-json');

    it('should be able to construct', (): void => {

        const clazz = new FetchJson(chance.string(), METHOD.GET, Sandbox.stub(), Sandbox.stub(), {});

        expect(clazz).to.be.instanceOf(FetchJson);
        expect(clazz).to.be.instanceOf(FetchBase);
    });
});
