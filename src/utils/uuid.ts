import { randomBytes } from 'crypto';
import { v4 } from 'uuid';

export default function generateUuid(length?: number): string {
	if (length) {
		return randomBytes(length * 2).toString('hex').substring(0, length);
	}

	const uuid = v4().toString().replace(/-/gi, '');
	return uuid;
};
