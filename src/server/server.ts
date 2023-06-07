import express, { Express, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import asyncHandler from './helpers/async-handler.js';
import errorHandler from './helpers/error-handler.js';
import response from './helpers/response.js';
import getToken from './helpers/get-token.js';
import jsonValidator from './helpers/json-validator.js';
import { error404Response, healthCheckResponse } from './helpers/basic-responses.js';

export interface ServerInterface {
	cors?: boolean;
	error404?: Function | any;
	healthCheck?: Function | any;
	hostname?: string;
	logger?: Function | any;
	port?: number;
	versions?: Array<Version>;
	maxBodySize?: string;
	rawBody?: boolean;
	appMiddlewares?: any[];
};

export interface Version {
	middlewares?: Array<Middleware>;
	path?: string;
	routes: Array<Route>;
};

export interface Middleware {
	condition?: Function;
	handler: Function;
};

export interface Route {
	dto?: Function;
	handler?: Function;
	method?: string;
	path?: string;
	public?: boolean;
	[key: string]: any;
};

export interface Request extends ExpressRequest {
	lanza?: any;
	rawBody?: Buffer;
};

export interface Response extends ExpressResponse {
	response?(code: number, data?: any, details?: object): any;
};

let app: Express;
let server: http.Server;
let logger: Function | any;

export default class Server implements ServerInterface {
	hostname: string;
	port: number;
	cors: boolean;
	versions: Array<Version>;
	healthCheck: Function | any;
	error404?: Function | any;
	maxBodySize?: string;
	rawBody?: boolean;
	appMiddlewares?: any;

	constructor(options: ServerInterface = {}) {
		this.hostname = options.hostname || '';
		this.port = options.port || 8000;
		this.cors = options.cors !== undefined ? !!options.cors : true;
		this.versions = options.versions || [];
		this.healthCheck = options.healthCheck || healthCheckResponse;
		this.error404 = options.error404 || error404Response;
		this.maxBodySize = options.maxBodySize || '200mb';
		this.rawBody = options.rawBody !== undefined ? !!options.rawBody : false;
		this.appMiddlewares = options.appMiddlewares;

		logger = options.logger;
	};

	async start() {
		app = express();

		// Configure CORS
		if (this.cors) {
			app.use(cors());
		}

		// Add custom appMiddlewares
		if (this.appMiddlewares) {
			for (const appMiddleware of this.appMiddlewares) {
				app.use(appMiddleware);
			}
		}

		// Remove headers
		app.disable('x-powered-by');

		// Handle body
		app.use(jsonValidator);

		if (this.rawBody) {
			app.use(bodyParser.json({
				limit: this.maxBodySize,
				verify: (req: Request, _res, buf) => {
					req.rawBody = buf;
				},
			}));
		} else {
			app.use(express.json({ limit: this.maxBodySize }));
		}

		// Use custom response
		app.use(response);

		// Create versions
		for (const version of this.versions) {
			this.createVersion(version);
		}

		app.use('/health', this.healthCheck);

		app.use(errorHandler);
		app.use(this.error404);

		await new Promise<void>((resolve, reject) => {
			try {
				server = app.listen(this.port, this.hostname, () => {
					resolve();
				});
			} catch (e) {
				reject(e);
			}
		});

		console.log(`Server listening on ${this.hostname ? `${this.hostname}:` : 'port '}${this.port}`);

		return true;
	};

	async stop() {
		if (!server) return false;

		server.close();
		console.log(`Server stopped`);

		return true;
	};

	private createVersion(version: Version) {
		const router = express.Router();
		const routerPath = version.path || '';
		app.use(routerPath, router);

		const middlewares = version.middlewares;

		// Add routes
		for (const route of version.routes) {
			this.addRoute(router, route, routerPath, middlewares);
		}
	};

	private addRoute(router: express.Router, route: Route, routerPath: string, customMiddlewares?: Array<Middleware>) {
		let middlewares = [];

		// @ts-ignore
		middlewares.push(asyncHandler(getToken));

		if (customMiddlewares && customMiddlewares.length) {
			for (const customMiddleware of customMiddlewares) {
				const { handler, condition } = customMiddleware;

				if (handler && (!condition || condition(route))) {
					// @ts-ignore
					middlewares.push(asyncHandler(handler, null, route));
				}
			}
		}

		// @ts-ignore
		middlewares.push(asyncHandler(route.handler, route.dto, route));

		const method = route.method || 'get';

		// @ts-ignore
		router[route.method || 'get'](route.path, middlewares);

		const spaces = ' '.repeat(8 - method.length);
		console.log(`${method.toUpperCase()}${spaces}${routerPath}${route.path}`);
	};

	static logger(code: any, method: any, url: any, error: any) {
		if (!logger) return false;

		return logger({
			code, method, url, error
		});
	};
};
