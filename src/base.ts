/**
 * @author WMXPY
 * @namespace Fetch
 * @description Base
 */

import { DraftFunction, produce } from "@sudoo/immutable";
import { Pattern } from "@sudoo/pattern";
import { Verifier, VerifyResult } from "@sudoo/verify";
import { BodyPreProcessFunction, FetchFunction, HeaderPreProcessFunction, METHOD, PostProcessFunction, ValidateFunction } from "./declare";
import { GlobalFetchManager } from "./global";
import { buildQuery, parseXHeader, parseJson } from "./util";

export type LogFunction = (...elements: any[]) => any;

export abstract class FetchBase {

    protected readonly _url: string;
    protected readonly _method: METHOD;

    protected readonly _fetch: FetchFunction;

    protected _name: string | null = null;

    protected _mode: RequestMode = "cors";
    protected _body: Record<string, any> = {};
    protected _query: Record<string, any> = {};
    protected _headers: Record<string, string> = {};
    protected readonly _globalHeaders: Record<string, string>;
    protected readonly _abortController: AbortController | undefined;

    protected _debugRequest: boolean = false;
    protected _debugResponse: boolean = false;
    protected _environment: string | null = null;
    protected _logFunction: LogFunction | null = null;

    protected _fallback: boolean = false;

    protected _headerPreProcessFunctions: HeaderPreProcessFunction[] = [];
    protected _bodyPreProcessFunctions: BodyPreProcessFunction[] = [];

    protected _validateFunctions: ValidateFunction[] = [];
    protected _postProcessFunctions: PostProcessFunction[] = [];

    protected constructor(
        url: string,
        method: METHOD,
        fetchFunction: FetchFunction,
        signal: AbortController | undefined,
        globalHeaders: Record<string, string>,
    ) {

        this._url = url;
        this._method = method;
        this._fetch = fetchFunction;
        this._abortController = signal;

        this._globalHeaders = globalHeaders;
    }

    public setName(name: string): this {

        this._name = name;
        return this;
    }

    public removeName(): this {

        this._name = null;
        return this;
    }

    public mergeHeaders(): Record<string, string> {

        return {
            ...this._headers,
            ...GlobalFetchManager.instance.headers,
        };
    }

    public param(key: string, value: string): this {

        this._query = {
            ...this._query,
            [key]: value,
        };
        return this;
    }

    public paramIfExist(key: string, value: string | undefined | null): this {

        if (value === undefined || value === null) {
            return this;
        }

        this._query = {
            ...this._query,
            [key]: value,
        };
        return this;
    }

    public append(query: Record<string, string>): this {

        const keys: string[] = Object.keys(query);

        for (const key of keys) {
            this.param(key, query[key]);
        }
        return this;
    }

    public appendIfExist(query: Record<string, string>): this {

        const keys: string[] = Object.keys(query);

        for (const key of keys) {
            this.paramIfExist(key, query[key]);
        }
        return this;
    }

    public query(query: Record<string, string>): this {

        this._query = query;
        return this;
    }

    public add(key: string, value: any): this {

        if (this._isBodyFree()) {
            throw new Error(`Request with ${this._method} method cannot have body.`);
        }

        this._body = {

            ...this._body,
            [key]: value,
        };
        return this;
    }

    public addIfExist(key: string, value: any): this {

        if (value === undefined || value === null) {
            return this;
        }

        return this.add(key, value);
    }

    public combine(body: Record<string, any>): this {

        const keys: string[] = Object.keys(body);

        for (const key of keys) {
            this.add(key, body[key]);
        }
        return this;
    }

    public combineIfExist(body: Record<string, any>): this {

        const keys: string[] = Object.keys(body);

        for (const key of keys) {
            this.addIfExist(key, body[key]);
        }
        return this;
    }

    public basic(token: string): this {

        return this.authorization('basic ' + token);
    }

    public bearer(token: string): this {

        return this.authorization('bearer ' + token);
    }

    public digest(token: string): this {

        return this.authorization('Digest ' + token);
    }

    public hoba(token: string): this {

        return this.authorization('HOBA ' + token);
    }

    public mutual(token: string): this {

        return this.authorization('Mutual ' + token);
    }

    public body(body: Record<string, any>): this {

        if (this._isBodyFree()) {
            throw new Error(`Request with ${this._method} method cannot have body.`);
        }

        this._body = body;
        return this;
    }

    public migrate(body: Record<string, any>): this {

        const keys: string[] = Object.keys(body);
        for (const key of keys) {
            this.add(key, body[key]);
        }
        return this;
    }

    public migrateIfExist(body: Record<string, any>): this {

        const keys: string[] = Object.keys(body);
        for (const key of keys) {
            this.addIfExist(key, body[key]);
        }
        return this;
    }

    public authorization(value: string): this {

        return this.header('Authorization', value);
    }

    public header(name: string, value: string): this {

        this._headers = {

            ...this._headers,
            [name]: value,
        };
        return this;
    }

    public headerIfExist(name: string, value: string | null | undefined): this {

        if (value === undefined || value === null) {
            return this;
        }

        return this.header(name, value);
    }

    public xHeader(name: string, value: string): this {

        this._headers = {

            ...this._headers,
            [parseXHeader(name)]: value,
        };
        return this;
    }

    public setMode(mode: RequestMode): this {

        this._mode = mode;
        return this;
    }

    public debug(
        environment: string = (process as any).env.NODE_ENV,
        logFunction: (...elements: any[]) => void = console.log,
    ): this {

        this._debugRequest = true;
        this._debugResponse = true;
        this._environment = environment;
        this._logFunction = logFunction;

        return this;
    }

    public debugRequest(
        environment: string = (process as any).env.NODE_ENV,
        logFunction: (...elements: any[]) => void = console.log,
    ): this {

        this._debugRequest = true;
        this._environment = environment;
        this._logFunction = logFunction;

        return this;
    }

    public debugResponse(
        environment: string = (process as any).env.NODE_ENV,
        logFunction: (...elements: any[]) => void = console.log,
    ): this {

        this._debugResponse = true;
        this._environment = environment;
        this._logFunction = logFunction;

        return this;
    }

    public setEnvironment(environment: string): this {

        this._environment = environment;
        return this;
    }

    public setLogFunction(logFunction: (...elements: any[]) => void): this {

        this._logFunction = logFunction;
        return this;
    }

    public enableFallback(): this {

        this._fallback = true;
        return this;
    }

    public disableFallback(): this {

        this._fallback = false;
        return this;
    }

    public getBody(): Record<string, any> | undefined {

        if (this._isBodyFree()) {
            return undefined;
        }
        return this._body;
    }

    public abort(): this {

        if (this._abortController) {
            this._abortController.abort();
        }
        return this;
    }

    public getAbortController(): AbortController | undefined {

        return this._abortController;
    }

    // Body Pre Process
    public addBodyProducePreProcessFunction<T extends Record<string, any> = any>(draftFunction: DraftFunction<T>): this {

        this.addBodyPreProcessFunction<T>((body: T) => {
            return produce(body, draftFunction);
        });
        return this;
    }

    public addBodyProducePreProcessFunctions<T extends Record<string, any> = any>(...draftFunctions: Array<DraftFunction<T>>): this {

        for (const each of draftFunctions) {
            this.addBodyProducePreProcessFunction<T>(each);
        }
        return this;
    }

    public addBodyPreProcessFunction<T extends Record<string, any> = any>(bodyPreProcessFunction: BodyPreProcessFunction<T>): this {

        this._bodyPreProcessFunctions.push(bodyPreProcessFunction);
        return this;
    }

    public addBodyPreProcessFunctions<T extends Record<string, any> = any>(...bodyPreProcessFunctions: Array<BodyPreProcessFunction<T>>): this {

        for (const each of bodyPreProcessFunctions) {
            this.addBodyPreProcessFunction(each);
        }
        return this;
    }

    public clearBodyPreProcessFunctions(): this {

        this._bodyPreProcessFunctions = [];
        return this;
    }

    // Header Pre Process
    public addHeaderProducePreProcessFunction<T extends Record<string, string> = any>(draftFunction: DraftFunction<T>): this {

        this.addHeaderPreProcessFunction<T>((header: T) => {
            return produce(header, draftFunction);
        });
        return this;
    }

    public addHeaderProducePreProcessFunctions<T extends Record<string, string> = any>(...draftFunctions: Array<DraftFunction<T>>): this {

        for (const each of draftFunctions) {
            this.addHeaderProducePreProcessFunction<T>(each);
        }
        return this;
    }

    public addHeaderPreProcessFunction<T extends Record<string, string> = any>(headerPreProcessFunction: HeaderPreProcessFunction<T>): this {

        this._headerPreProcessFunctions.push(headerPreProcessFunction);
        return this;
    }

    public addHeaderPreProcessFunctions<T extends Record<string, string> = any>(...headerPreProcessFunctions: Array<HeaderPreProcessFunction<T>>): this {

        for (const each of headerPreProcessFunctions) {
            this.addHeaderPreProcessFunction(each);
        }
        return this;
    }

    public clearHeaderPreProcessFunctions(): this {

        this._headerPreProcessFunctions = [];
        return this;
    }

    // Validation
    public addVerifyValidation(pattern: Pattern): this {

        const verifier: Verifier = Verifier.create(pattern);
        this.addValidateFunction((response: any) => {
            const verifyResult: VerifyResult = verifier.verify(response);
            return verifyResult.succeed;
        });
        return this;
    }

    public addValidateFunction<T extends any = any>(validateFunction: ValidateFunction<T>): this {

        this._validateFunctions.push(validateFunction);
        return this;
    }

    public addValidateFunctions<T extends any = any>(...validateFunctions: Array<ValidateFunction<T>>): this {

        for (const each of validateFunctions) {
            this.addValidateFunction(each);
        }
        return this;
    }

    public clearValidationFunctions(): this {

        this._validateFunctions = [];
        return this;
    }


    // Post Process
    public addProducePostProcessFunction<T extends any = any>(draftFunction: DraftFunction<T>): this {

        this.addPostProcessFunction<T>((response: T) => {
            return produce(response, draftFunction);
        });
        return this;
    }

    public addProducePostProcessFunctions<T extends any = any>(...draftFunctions: Array<DraftFunction<T>>): this {

        for (const each of draftFunctions) {
            this.addProducePostProcessFunction<T>(each);
        }
        return this;
    }

    public addPostProcessFunction<T extends any = any>(postProcessFunction: PostProcessFunction<T>): this {

        this._postProcessFunctions.push(postProcessFunction);
        return this;
    }

    public addPostProcessFunctions<T extends any = any>(...postProcessFunctions: Array<PostProcessFunction<T>>): this {

        for (const each of postProcessFunctions) {
            this.addPostProcessFunction(each);
        }
        return this;
    }

    public clearPostProcessFunctions(): this {

        this._postProcessFunctions = [];
        return this;
    }

    // Pre Process
    public getPreProcessedHeaders(): Record<string, string> {

        const headers: Record<string, string> = this.mergeHeaders();

        if (this._headerPreProcessFunctions.length === 0) {
            return headers;
        }

        const processed: Record<string, string> = this._headerPreProcessFunctions.reduce(
            (previous: Record<string, string>, current: HeaderPreProcessFunction) => current(previous),
            headers,
        );
        return processed;
    }

    public getPreProcessedBody(): Record<string, any> | undefined {

        const body: Record<string, any> | undefined = this.getBody();

        if (typeof body === 'undefined') {
            return undefined;
        }

        if (this._bodyPreProcessFunctions.length === 0) {
            return body;
        }

        const processed: Record<string, any> = this._bodyPreProcessFunctions.reduce(
            (previous: Record<string, any>, current: BodyPreProcessFunction) => current(previous),
            body,
        );
        return processed;
    }

    // Fetch
    protected async processTextResponse(response: Response): Promise<string> {

        this.logRequestMessage();

        const raw: string = await response.text();

        if (response.ok) {
            this.logResponseMessage(raw);
            return this.executePostProcessFunctions<string>(raw);
        }
        throw new Error(raw);
    }

    protected async processJsonResponse<T extends any = any>(response: Response): Promise<T> {

        this.logRequestMessage();

        const raw: string = await response.text();
        const data: T = parseJson(raw, this._fallback);

        if (response.ok) {

            this.logResponseMessage(data);
            return this.executePostProcessFunctions<T>(data);
        }

        throw new Error(raw);
    }

    // Protected And Private
    protected buildUrl(): string {

        if (this.hasQuery()) {

            return this._url + '?' + this.buildQuery();
        }
        return this._url;
    }

    protected hasQuery(): boolean {

        return Object.keys(this._query).length > 0;
    }

    protected buildQuery(): string {

        return buildQuery(this._query);
    }

    protected getAbortSignal(): AbortSignal | undefined {

        if (this._abortController) {
            return this._abortController.signal;
        }
        return undefined;
    }

    protected logRequestMessage(): void {

        if (
            this._debugRequest
            && this._environment === 'development'
            && this._logFunction
            && typeof this._logFunction === 'function'
        ) {

            if (typeof this._name === 'string') {
                this._logFunction('FETCH-DEBUG-REQUEST', this._name, this._buildRequestInfo());
                return;
            }

            this._logFunction('FETCH-DEBUG-REQUEST', this._buildRequestInfo());
        }
    }

    protected logResponseMessage(...elements: any[]): void {

        if (
            this._debugResponse
            && this._environment === 'development'
            && this._logFunction
            && typeof this._logFunction === 'function'
        ) {

            if (typeof this._name === 'string') {
                this._logFunction('FETCH-DEBUG-RESPONSE', this._name, ...elements);
                return;
            }

            this._logFunction('FETCH-DEBUG-RESPONSE', ...elements);
        }
    }

    protected executeValidateFunctions<T extends any = any>(response: T): boolean {

        if (this._validateFunctions.length === 0) {
            return true;
        }

        const result: boolean = this._validateFunctions.every((each: ValidateFunction) => each(response));
        return result;
    }

    protected executePostProcessFunctions<T extends any = any>(response: T): T {

        if (this._postProcessFunctions.length === 0) {
            return response;
        }

        const processed: T = this._postProcessFunctions.reduce(
            (previous: T, current: PostProcessFunction) => current(previous),
            response,
        );
        return processed;
    }

    protected reverseExecutePostProcessFunctions<T extends any = any>(response: T): T {

        if (this._postProcessFunctions.length === 0) {
            return response;
        }

        const processed: T = this._postProcessFunctions.reduceRight(
            (previous: T, current: PostProcessFunction) => current(previous),
            response,
        );
        return processed;
    }

    protected executeHeaderPreProcessFunctions<T extends Record<string, string> = any>(header: T): T {

        if (this._headerPreProcessFunctions.length === 0) {
            return header;
        }

        const processed: T = this._headerPreProcessFunctions.reduce(
            (previous: T, current: HeaderPreProcessFunction<T>) => current(previous),
            header,
        );
        return processed;
    }

    protected reverseHeaderPreProcessFunctions<T extends Record<string, string> = any>(header: T): T {

        if (this._headerPreProcessFunctions.length === 0) {
            return header;
        }

        const processed: T = this._headerPreProcessFunctions.reduceRight(
            (previous: T, current: HeaderPreProcessFunction<T>) => current(previous),
            header,
        );
        return processed;
    }

    protected executeBodyPreProcessFunctions<T extends Record<string, any> = any>(body: T): T {

        if (this._bodyPreProcessFunctions.length === 0) {
            return body;
        }

        const processed: T = this._bodyPreProcessFunctions.reduce(
            (previous: T, current: BodyPreProcessFunction<T>) => current(previous),
            body,
        );
        return processed;
    }

    protected reverseBodyPreProcessFunctions<T extends Record<string, any> = any>(body: T): T {

        if (this._bodyPreProcessFunctions.length === 0) {
            return body;
        }

        const processed: T = this._bodyPreProcessFunctions.reduceRight(
            (previous: T, current: BodyPreProcessFunction<T>) => current(previous),
            body,
        );
        return processed;
    }

    private _buildRequestInfo(): Record<string, any> {

        return {
            Url: this._url,
            Built: this.buildUrl(),
            Query: this._query,
            Method: this._method,
            Mode: this._mode,
            Header: this._headers,
            Body: this._body,
        };
    }

    private _isBodyFree(): boolean {

        return this._method === METHOD.GET
            || this._method === METHOD.HEAD
            || this._method === METHOD.OPTION;
    }
}
