/**
 * Go through a list of values and value generators, and return the first value that evaluates truthy
 * Execute each generator function with the given args and return the result if it exists
 * 
 * @param conditionals Array of values and generators to evaluate
 * 
 * @returns A function that returns the first truthy value
 */
export const or = <Return = unknown, Args extends Array<unknown> = Array<unknown>>(...conditionals: Array<Return | undefined | ((...args: Args) => Return | undefined)>) => (...args: Args): Return | undefined => {
	for (const conditional of conditionals) {
		const result = typeof conditional === 'function'
			? (conditional as (...args: Args) => Return | undefined)(...args)
			: conditional
		if (result) return result
	}
}

export const evaluateString = <Args extends Array<unknown> = Array<unknown>>(...conditionals: Array<string | undefined | ((...args: Args) => string | undefined)>) => or<string, Args>(...conditionals)
