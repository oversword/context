import {
	ContextAction,
	ContextConfig,
	ContextData,
	ContextDataGenerator,
	ContextSelector,
	StoreMetaList,
} from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'
import { ContextSystemConfig } from '@/types/system.types'
// import storeMetaHasType from '../store-meta-has-type'
import selectorMatch from '@/selector'
import { inactiveLog as log } from '@/side-effects/debug-log'

const dataMerge = (configuration: Pick<ContextSystemConfig, 'strategy_mergeData'>, action: PartialOmit<ContextAction, 'data' | 'action'>) =>
	(current: ContextData, [,config]: ContextEntry): ContextData => {
		if (!(config && config.data)) return current
		let dataGen: ContextDataGenerator

		if (typeof config.data === 'function') 
			dataGen = config.data
		else dataGen = configuration.strategy_mergeData(config.data)
	
		if (dataGen)
			return dataGen(action, current)
		return current
	}
type ContextEntry = [ContextSelector,ContextConfig]

/**
 * Merges data from all given StoreMetas relating to the action
 * 
 * @param configuration The system configuration
 * @param contexts The contexts to extract data from
 * @param action The current data available for the action
 * 
 * @returns The full data for the given action
 */
const contextsDecideData = (
	configuration: Pick<ContextSystemConfig, 'strategy_mergeData'>,
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'data' | 'action'>,
): ContextData => {
	log('contextsDecideData', {contexts,action})
	const merger = dataMerge(configuration, action)
	// const firstType = contexts.findIndex(storeMetaHasType)
	// const typeAfter = firstType === -1 ? contexts.length : contexts.slice(firstType + 1).findIndex(storeMetaHasType)
	// const nextType = typeAfter === -1 ? contexts.length : firstType + 1 + typeAfter
	return contexts.reduce((current: ContextData, { config, data }, _index): ContextData => {
		const selfConfig = (data || config)// && (index < nextType)
		const { overrides } = config
		log('contextsDecideData:', {selfConfig,overrides,data,config})
		if (!(selfConfig || overrides)) return current

		const selfMenu: Array<ContextEntry> = selfConfig
			? [
				...(config? [
					['self',config] as ContextEntry
				] : []),
				...(data? [
					['self',{data}] as ContextEntry
				] : []),
			]
			: []
		const matchingOverrides = Object.entries(overrides || {}).filter(selectorMatch(action.path))
		
		return selfMenu.concat(matchingOverrides).reduce(merger, current)
	}, {})
}

export default contextsDecideData
