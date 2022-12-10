export default function createRandomString(length:number = 32): string {
	let string = '';
	let characters = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890';
	let charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		string += characters.charAt(Math.floor(Math.random() *  charactersLength));
	}

	return string;
};
