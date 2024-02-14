/**
 * Make only the given keys of an object optional
 */
type PartialOmit<P, O extends keyof P> = Omit<P, O> & Partial<P>;

export default PartialOmit
