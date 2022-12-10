import { Database } from '../src';

console.log = console.error = () => {};

test('Construct database', () => {
	const database = new Database({ host: 'test' });
	expect(database.host).toBe('test');
});

test('Reject not supported dialect', async () => {
	const database = new Database({ dialect: 'mongodb' });
	const connection = await database.connect();

	expect(connection).toBe(null);
});
