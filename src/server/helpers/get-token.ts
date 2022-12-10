import { Request, Response } from '../server.js';

interface Query {
	[key: string]: string;
};

export default async function getToken(req: Request, _res: Response, next: Function) {
	let token: string | null = null;

	// Check bearer token
	const authorizationHeader = req.headers && req.headers.authorization;

	if (authorizationHeader) {
		const tokenParts = authorizationHeader.split('Bearer ');
		token = tokenParts[1] || null;
	}

	// Check query token
	const tokenQuery = req.query && (req.query as Query).token;

	if (tokenQuery) {
		token = tokenQuery;
	}

	if (!req.lanza) req.lanza = {};
	req.lanza.token = token;

	next();
};
