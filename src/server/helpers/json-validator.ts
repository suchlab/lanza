import { Request, Response } from '../server.js';

export default function (req: Request, res: Response, next: Function) {
	if (req.is('application/json')) {
		let body: any = '';

		req.on('data', function(chunk) { 
			body += chunk;
		});

		req.on('end', function() {
			if (body) {
				try {
					JSON.parse(body);
				} catch {
					res.status(400).send({
						error: {
							message: 'Invalid JSON body',
						},
					});
				}

				next();
			}
		});
	}

	next();
};
