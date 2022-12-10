import { hashSync, compareSync } from 'bcrypt';

const PASSWORD_HASH_SALT_ROUNDS = 10;

function hash(password: string): string {
	return hashSync(password, PASSWORD_HASH_SALT_ROUNDS);
}

function compare(password: string, hashed_password: string): boolean {
	return compareSync(password, hashed_password || '');
}

export default {
	hash,
	compare,
};
