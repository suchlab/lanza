import { createPool, Pool } from 'mysql2';

export interface DatabaseInterface {
	host?: string;
	port?: number;
	user?: string;
	password?: string;
	database?: string;
	connectionLimit?: number;
	dialect?: string;
}

interface PoolInterface extends Pool {
	[key: string]: any;
};

let pool: PoolInterface;

export default class Database implements DatabaseInterface {
	host?: string;
	port?: number;
	user?: string;
	password?: string;
	database?: string;
	connectionLimit?: number;
	dialect?: string;

	constructor(options: DatabaseInterface = {}) {
		this.host = options.host || 'localhost';
		this.port = options.port || 8889;
		this.user = options.user || 'root';
		this.password = options.password || 'root';
		this.database = options.database || 'database';
		this.connectionLimit = options.connectionLimit || 10;

		this.dialect = options.dialect || 'mysql';
	}

	async connect(): Promise<Pool | null> {
		// Check dialect
		if (this.dialect !== 'mysql') {
			console.error(`${this.dialect} not supported`);
			return null;
		}

		// Create pool
		pool = createPool({
			connectionLimit: this.connectionLimit,
			host: this.host,
			port: this.port,
			user: this.user,
			password: this.password,
			database: this.database,
			namedPlaceholders: true,
		});

		// Check connection
		try {
			await Database.query('SELECT 1 + 1 AS testConnection', {}, pool);
		} catch (e) {
			console.error('Could not connect to database.' + ' ' + (e.sqlMessage || e.message || e.code));
			return null;
		}

		console.info('Connected to database');

		return pool;
	}

	static async databaseOperation(type: string, sql: string, values?: object | object[], databasePool?: Pool): Promise<any> {
		if (!pool && !databasePool) {
			console.error('Missing connection to database');
			return null;
		}

		const databaseConnection: PoolInterface = databasePool || pool; 

		return new Promise(( resolve, reject ) => {
			databaseConnection[type](sql, values, (err: any, rows: any) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	static async query(sql: string, values?: object | object[], databasePool?: Pool): Promise<any> {
		return await Database.databaseOperation('query', sql, values, databasePool);
	}

	static async execute(sql: string, values?: object | object[], databasePool?: Pool): Promise<any> {
		return await Database.databaseOperation('execute', sql, values, databasePool);
	}
};
