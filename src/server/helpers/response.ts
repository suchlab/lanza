import Server, { Request, Response } from '../server.js';

interface resParams {
	[key:string]: any;
};

export default function (req: Request, res: Response, next: Function) {
	res.response = async (code: number = 200, data = false, details) => {
		let error;

		if (typeof data === 'function') data = null;

		if (typeof data === 'string') {
			if (code !== 200) {
				error = new Error(data);
				data = null;
			} else {
				return res.status(code).send(data);
			}
		}

		if (typeof data === 'boolean') {
			return res.status(data ? 200 : 400).json({ success: data });
		}

		if (data instanceof Error) {
			error = data;
			data = null;
		}

		let resParams:resParams = {};
		if (data) resParams = data;

		if (code !== 200 && !data) {
			resParams.error = { message: error.message, details };
			console.error('Error: ', `${code} ${req.method} ${req.originalUrl} ${error.message}`);
			if (code >= 500) console.error(error.stack);

			// Custom logger
			Server.logger(code, req.method, req.originalUrl, error);
		}

		return res.status(code).json(resParams);
	};

	next();
};
