/* eslint-disable  @typescript-eslint/no-explicit-any */
type Handler<I, R> = ((interrupt: I) => undefined | R | PromiseLike<R>)
export class Interruptable<T, I, R = void> extends Promise<T> {
	#settled = false
	#interruptHandlers: Array<Handler<I, R>> = []
	#waited = false
	constructor(executor: (
      resolve: ((value: T | PromiseLike<T>) => void), 
      reject: ((reason?: any) => void),
      receive: ((callback: Handler<I, R>) => void),
    ) => void) {
		let waited = false
		const addHandler = (handler: Handler<I, R>) =>  {
			if (this.#settled) return
			this.#interruptHandlers.push(handler)
		}
		super((resolve,reject) => {
			executor(value => {
				this.#settled = true
				resolve(value)
			}, reason => {
				this.#settled = true
				reject(reason)
			}, (handler: Handler<I, R>) => {
				if (waited) addHandler(handler)
				else setTimeout(() => {
					this.#waited = true
					waited = true
					addHandler(handler)
				})
			})
		})
	}
	async interrupt(interrupt: I): Promise<R> {
		if (this.#settled) return

		if (!this.#waited) await new Promise(resolve => setTimeout(resolve))

		for (const handler of this.#interruptHandlers) {
			const result = await handler.call(this, interrupt)
			if (result !== undefined) return result
			if (this.#settled) return
		}
	}
}
export default Interruptable