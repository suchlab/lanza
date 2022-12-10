class CustomError extends Error {
	status: number;
};

class NotFoundError extends CustomError {
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
		this.message = message || 'Not found';
		this.status = 404;
	}
};

class ValidationError extends CustomError {
	errors: any[];
	constructor(message: string, errors?: Array<any>) {
		super(message);
		this.name = 'ValidationError';
		this.message = message || 'Error validating object data';
		this.errors = errors || [];
		this.status = 400;
	}
};

class ServerError extends CustomError {
	constructor(message: string) {
		super(message);
		this.name = 'ServerError';
		this.message = message || 'Error handling data';
		this.status = 500;
	}
};

class ForbiddenError extends CustomError {
	constructor(message: string) {
		super(message);
		this.name = 'ForbiddenError';
		this.message = message || 'Forbidden';
		this.status = 403;
	}
};

class MissingParametersError extends CustomError {
	errors: any[];
	constructor(message?: string, errors?: Array<any>) {
		super(message);
		this.name = 'ValidationError';
		this.message = message || 'Missing parameters';
		this.errors = errors || [];
		this.status = 401;
	}
};

export {
	NotFoundError,
	ValidationError,
	ServerError,
	ForbiddenError,
	MissingParametersError,
};
