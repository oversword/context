import { ContextTypeList, StoreMetaList } from '../../types/index.types'
import filterTruthy from '../../../array/iterators/filter-truthy'

const contextsExtractPath = (contexts: StoreMetaList): ContextTypeList =>
	(contexts.map(({ config }) => config.type).filter(filterTruthy) as Array<string>).reverse()
export default contextsExtractPath
