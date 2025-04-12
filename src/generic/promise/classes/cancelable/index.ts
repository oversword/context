/* eslint-disable  @typescript-eslint/no-explicit-any */
export class CanceledError extends Error {
	#value = undefined
	readonly value: any = undefined
	constructor(messageOrError: any) {
		super(messageOrError instanceof Error ? messageOrError.message : ((messageOrError && String(messageOrError)) || ''))
		this.value = messageOrError
	}
}
type Callback = ((reason?: any) => void)
export class Cancelable<T> extends Promise<T> {
	#canceled = false
	#settled = false
	#reject: Callback = () => {}
	#canceledReason = null
	#cancelCallbacks: Array<Callback> = []
	constructor(executor: (
      resolve: (value: T | PromiseLike<T>) => void, 
      reject: Callback,
      onCancel: (callback: Callback) => void
    ) => void) {
		let rej: Callback
		let waited = false
		const addCallback = (callback: Callback) =>  {
			if (this.#settled) return
			if (this.#canceled) {
				callback(this.#canceledReason)
				return
			}
			this.#cancelCallbacks.push(callback)
		}
		super((resolve,reject) => {
			executor(value => {
				if (this.#canceled) return
				this.#settled = true
				resolve(value)
			}, reason => {
				if (this.#canceled) return
				this.#settled = true
				reject(reason)
			}, (callback: Callback) => {
				if (waited) addCallback(callback)
				else setTimeout(() => {
					waited = true
					addCallback(callback)
				})
			})
			rej = reject
		})
		this.#reject = rej
	}
	cancel(reason?: any) {
		if (this.#settled) return
		if (this.#canceled) return

		this.#canceled = true
		this.#canceledReason = reason

		this.#cancelCallbacks.forEach(callback => callback.call(this, reason))
		this.#cancelCallbacks = []

		this.#reject(new CanceledError(reason))
	}
}
export default Cancelable