import { ContextTypeList, StoreMetaList } from '@/types/index.types'
import filterTruthy from '@/generic/array/iterators/filter-truthy'

/**
 * Extract a list of ancestors from a list of StoreMetas
 * 
 * @param contexts The contexts to be looked through
 * 
 * @returns The list of all types in the contexts
 */
const contextsExtractPath = (contexts: StoreMetaList): ContextTypeList =>
	(contexts.map(({ config }) => config.type).filter(filterTruthy) as Array<string>).reverse()

	export default contextsExtractPath
