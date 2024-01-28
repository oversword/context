import { ContextTypeList, StoreMetaList } from '../types/index.types';
import filterTruthy from '../utils/filter-truthy';

const contextsPath = (contexts: StoreMetaList): ContextTypeList =>
  (contexts.map(({ config }) => config.type).filter(filterTruthy) as Array<string>).reverse();
export default contextsPath;
