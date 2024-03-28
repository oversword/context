
/**
 * Converts a dash (-), or underscore (_) separated, lowercase string
 * into a space separated, capitalised string.
 *
 * e.g. "this-machine_name" => "This Machine Name"
 *
 * @param str Some machine name
 * @returns The human version of the name
 */
const humanise = (str: string): string =>
	str
		.split(/[_-]+/g)
		.map(s => s[0].toUpperCase() + s.slice(1))
		.join(' ')
export default humanise