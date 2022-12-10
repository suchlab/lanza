import { Request, Response } from '../server.js';

export function error404Response(_req: Request, res: Response) {
	res.status(404).send({
		error: {
			message: 'Not found',
		},
	});
};

export function healthCheckResponse(_req: Request, res: Response) {
	res.setHeader('Content-Type', 'text/plain');
	res.status(200).send('OK');
};
