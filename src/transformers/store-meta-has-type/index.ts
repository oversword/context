import {
	StoreMeta,
	ContextType
} from '@/types/index.types'

const storeMetaHasType = (storeMeta: StoreMeta): storeMeta is Omit<StoreMeta, 'config'> & { config: Omit<StoreMeta['config'], 'type'> & { type: ContextType; }; } =>
	Boolean(storeMeta.config && storeMeta.config.type)
export default storeMetaHasType