import { Request, Response } from '../server.js';
import response from './response.js';

export default function errorHandler(err: any, req: Request, res: Response, next: Function) {
	if (!res.response) return response(req, res, () => {});
	if (!err.status) err.status = 500;
	if (!err.message) err.message = 'Unknown error';

	return res.response(err.status, err);
};
