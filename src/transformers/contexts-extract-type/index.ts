import { ContextType, StoreMetaList } from '@/types/index.types'
import storeMetaHasType from '../store-meta-has-type'

const _CONTEXTS_GETTYPE_GENERIC = { config: { type: 'generic' } }

/**
 * Finds the first context which specifies a `type` and extract that type
 * 
 * @param contexts List of StoreMetas to look through
 * 
 * @returns the type of the first context, or 'generic'
 */
const contextsExtractType = (contexts: StoreMetaList): ContextType =>
	(contexts.find(storeMetaHasType) || _CONTEXTS_GETTYPE_GENERIC)
		.config.type as string

export default contextsExtractType
