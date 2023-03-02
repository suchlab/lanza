import { Server } from '../src';
import { Request, Route } from '../src/server/server.js';

import axios from 'axios';

let server: any;
let request: any;

const ENDPOINT = 'http://localhost:8008';

const mockLogger = jest.fn();

//console.log = console.error = () => {};

test('Server configuration', () => {
	const server = new Server({ port: 1000 });
	const serverPort = server.port;

	expect(serverPort).toBe(1000);
});

test('Server start', async () => {
	server = new Server({
		port: 8008,
		logger: mockLogger,
		versions: [{
			middlewares: [
				{
					handler: (_req: any, _res: any) => { return { name: 'Jane' } },
					condition: (route: Route) => { return route.testMiddleware },
				},
				{
					handler: (req: any, _res: any, next: any, route: Route) => {
						req.routeParam = route.routeParam;
						next();
					},
					condition: (route: Route) => { return route.routeMiddleware },
				}
			],
			routes: [
				{
					path: '/basic',
					handler: (_req: any, res: any) => {
						res.response(200, { success: true });
					}
				},
				{
					path: '/default-response',
					handler: () => {
						return { success: true, name: 'Peter', surname: 'Parker' };
					},
					dto: (object: any) => {
						return {
							success: object.success,
							name: object.name,
						}
					}
				},
				{
					path: '/plain-text',
					handler: () => {
						return 'ok';
					}
				},
				{
					path: '/boolean',
					handler: () => {
						return true;
					}
				},
				{
					path: '/middleware',
					testMiddleware: true,
					handler: (_req: any, res: any) => {
						res.response(200, { name: 'Peter' });
					}
				},
				{
					path: '/logger',
					handler: () => {
						throw new Error();
					}
				},
				{
					path: '/token',
					handler: (req: Request) => {
						return { token: req.lanza.token }
					}
				},
				{
					path: '/route',
					routeMiddleware: true,
					routeParam: 'HelloRouteParam',
					handler: (req: any, res: any) => {
						res.response(200, { routeParam: req?.routeParam });
					}
				},
				{
					path: '/raw-body',
					method: 'post',
					handler: (req: any, res: any) => {
						res.response(200, { raw: req?.rawBody });
					}
				}
			]
		}]
	});

	const result = await server.start();
	expect(result).toBe(true);
});

test('Check health endpoint', async () => {
	const request = await axios.get(`${ENDPOINT}/health`);
	expect(request.data).toBe('OK');
});

test('Check basic request', async () => {
	const request = await axios.get(`${ENDPOINT}/basic`);
	expect(request.data.success).toBe(true);
});

test('Check default object response', async () => {
	request = await axios.get(`${ENDPOINT}/default-response`);
	expect(request.data.success).toBe(true);
});

test('Check DTO from default object response', async () => {
	expect(request.data.name).toBe('Peter');
	expect(request.data.surname).toBe(undefined);
});

test('Check plain text response', async () => {
	request = await axios.get(`${ENDPOINT}/plain-text`);
	expect(request.data).toBe('ok');
});

test('Check boolean response', async () => {
	request = await axios.get(`${ENDPOINT}/boolean`);
	expect(request.data.success).toBe(true);
});

test('Custom middleware', async () => {
	request = await axios.get(`${ENDPOINT}/middleware`);
	expect(request.data.name).toBe('Jane');
});

test('Custom logger', async () => {
	try {
		await axios.get(`${ENDPOINT}/logger`);
	} catch (e) {}
	
	expect(mockLogger).toBeCalledTimes(1);
});

test('Empty token', async () => {
	request = await axios.get(`${ENDPOINT}/token?token=`);
	expect(request.data.token).toBe(null);
});

test('Token via query', async () => {
	request = await axios.get(`${ENDPOINT}/token?token=thisisatoken`);
	expect(request.data.token).toBe('thisisatoken');
});

test('Token via header', async () => {
	request = await axios.get(`${ENDPOINT}/token`, { headers: { authorization: 'Bearer thisisatoken' }});
	expect(request.data.token).toBe('thisisatoken');
});

test('Token via query overrides header', async () => {
	request = await axios.get(`${ENDPOINT}/token?token=other`, { headers: { authorization: 'Bearer thisisatoken' }});
	expect(request.data.token).toBe('other');
});

test('Handler gets route configuration', async () => {
	request = await axios.get(`${ENDPOINT}/route`);
	expect(request.data.routeParam).toBe('HelloRouteParam');
});

test('Raw body', async () => {
	request = await axios.post(`${ENDPOINT}/raw-body`, { data: 'hello' });
	expect(Buffer.from(request.data.raw).toString()).toBe('{\"data\":\"hello\"}');
});

test('Server stop', async () => {
	const result = await server.stop();
	expect(result).toBe(true);
});
