const partition = <T = unknown>(
  list: Array<T>,
  partitioner: (item: T, index: number, list: Array<T>) => boolean,
  initial: [typeof list, typeof list],
): typeof initial =>
  list.reduce((current: typeof initial, item: T, index: number, list: Array<T>): typeof initial => {
    const result = partitioner(item, index, list);
    current[Number(result)].push(item);
    return current;
  }, initial);
export default partition;
