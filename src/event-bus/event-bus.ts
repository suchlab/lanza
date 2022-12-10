import { EventEmitter } from 'events';

let eventBusInstance: EventEmitter | null;

export interface Subscriber {
	event: string;
	handler: Function;
};

export interface EventData {
	[key:string]: any;
}

export default class EventBus extends EventEmitter {
	static init(subscribers: Subscriber[]): EventEmitter {
		// If instance was already created, return it
		if (eventBusInstance) return eventBusInstance;
 
		// Start instance
		eventBusInstance = new EventBus();

		// Load all listeners
		subscribers.forEach((subscriber) => {
			this.subscribe(subscriber.event, subscriber.handler);
		});

		return eventBusInstance;
	}

	static destroy() {
		if (eventBusInstance) eventBusInstance.removeAllListeners();
		eventBusInstance = null;
	}

	static publish(name: string, data: EventData) {
		if (!eventBusInstance) return false;
		eventBusInstance.emit(name, data);
	}

	static subscribe(name: string, callback: Function) {
		if (!eventBusInstance) return false;

		eventBusInstance.on(name, (...args: any) => {
			try {
				callback(...args);
			} catch (err) {
				console.error(err);
			}
		});
	}
};
