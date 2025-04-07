const getPath = <R = unknown>(object: unknown, path: Array<string | number | symbol> = []): R => {
	if (path.length === 0 || typeof object !== 'object' || !object) return object as R
	return getPath(object[path[0]], path.slice(1)) as R
}
export default getPath