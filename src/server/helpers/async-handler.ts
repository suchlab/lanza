import dto from '../../utils/dto.js';
import { Route } from '../server.js';

export default function asyncHandler(fn: Function, customDto?: Function, route?: Route) {
	return async function (req: any, res: any, next: (reason: any) => Promise<any>) {
		try {
			const response = await Promise
				.resolve(fn(req, res, next, route))
				.catch(next);

			if (response !== undefined && !res.headersSent) {
				const responseBody = (customDto ? dto(response, customDto) : response);
				res.response(200, responseBody);
			}

			return response;
		} catch (e) {
			next(e);
		}
	};
};
