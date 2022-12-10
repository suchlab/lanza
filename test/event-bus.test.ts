import { EventBus } from '../src';

test('Initiate and invoke', () => {
	const callback = jest.fn();

	EventBus.init([{
		event: 'test',
		handler: callback,
	}]);

	EventBus.publish('test', { name: 'Peter' });

	expect(callback).toBeCalledTimes(1);
	expect(callback).toBeCalledWith({ name: 'Peter' });
});
