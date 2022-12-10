import { randomString } from '../src';

test('Generate random string', () => {
	expect(randomString(40).length).toBe(40);
});
