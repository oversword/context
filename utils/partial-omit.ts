type PartialOmit<P, O extends keyof P> = Omit<P, O> & Partial<P>;

export default PartialOmit;
