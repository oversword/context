import {
	StoreMeta,
	ContextType
} from '@/types/index.types'

/**
 * Checks if a given StoreMeta defines the 'type' property
 * 
 * @param storeMeta StoreMeta to check
 * 
 * @returns boolean if storeMeta.config.type exists
 */
const storeMetaHasType = (storeMeta: StoreMeta): storeMeta is Omit<StoreMeta, 'config'> & { config: Omit<StoreMeta['config'], 'type'> & { type: ContextType; }; } =>
	Boolean(storeMeta.config && storeMeta.config.type)
export default storeMetaHasType