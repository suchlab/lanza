export default (objectList: any, func: Function): object | object[] => {
	const isArray = Array.isArray(objectList)
	const original = isArray ? objectList : [objectList];
	const remapped = original.map(object => func(object));

	return isArray ? remapped : remapped[0];
};
