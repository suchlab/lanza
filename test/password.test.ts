import { password } from '../src';

const TEST_PASSWORD = 'toolstolaunchideasfaster';

let hashedPassword: string;

test('Hash password', () => {
	hashedPassword = password.hash(TEST_PASSWORD);
	expect(!!hashedPassword).toBe(true);
});

test('Compare bad password', () => {
	expect(password.compare('awrongpassword', hashedPassword)).toBe(false);
});

test('Compare good password', () => {
	expect(password.compare(TEST_PASSWORD, hashedPassword)).toBe(true);
});
