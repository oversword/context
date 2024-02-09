import { ContextType, StoreMetaList } from '../../types/index.types'

const _CONTEXTS_GETTYPE_GENERIC = { config: { type: 'generic' } }

/**
 * 
 * @param contexts 
 * @returns 
 */
const contextsExtractType = (contexts: StoreMetaList): ContextType =>
	(contexts.find(({ config }): ContextType | undefined => config.type) || _CONTEXTS_GETTYPE_GENERIC)
		.config.type as string

export default contextsExtractType
