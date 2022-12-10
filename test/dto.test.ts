import { dto } from '../src';

function customDto(object: any) {
	return {
		id: object.id,
	};
};

const object = {
	id: 'abc',
	name: 'ABC',
};

test('Array DTO', () => {
	const objects = [object];

	const result = dto(objects, customDto);

	// @ts-ignore-all
	expect(result[0].id).toBe('abc');

	// @ts-ignore
	expect(result[0].name).toBe(undefined);
});

test('Object DTO', () => {
	const result = dto(object, customDto);

	// @ts-ignore-all
	expect(result.id).toBe('abc');

	// @ts-ignore
	expect(result.name).toBe(undefined);
});
