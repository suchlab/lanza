import { uuid } from '../src';

test('Generate uuid', () => {
	expect(uuid().length).toBe(32);
});

test('Generate uuid with 12 characters', () => {
	expect(uuid(12).length).toBe(12);
});
