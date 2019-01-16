/**
 * @author WMXPY
 * @namespace Fetch
 * @description Json
 * @package Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { METHOD } from "../../src/declare";
import { FetchJson } from "../../src/json";

describe('Given a {FetchJson} class', (): void => {

    const chance: Chance.Chance = new Chance('fetch-json');

    it('should be able to construct', (): void => {

        const clazz = new FetchJson(chance.string(), METHOD.GET);

        expect(clazz).to.be.instanceOf(FetchJson);
    });
});
