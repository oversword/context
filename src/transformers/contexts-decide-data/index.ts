import {
	ContextAction,
	ContextData,
	ContextDataGenerator,
	StoreMetaList,
} from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'
import { ContextSystemConfig } from '@/types/system.types'

const dataMerge =
	(configuration: Pick<ContextSystemConfig, 'strategy_mergeData'>, action: PartialOmit<ContextAction, 'data' | 'action'>) =>
		(current: ContextData, data: undefined | ContextData | ContextDataGenerator): ContextData => {
			if (!data) return current
			let dataGen: ContextDataGenerator
			if (typeof data === 'function') 
				dataGen = data
			else dataGen = configuration.strategy_mergeData(data)
			if (dataGen)
				return dataGen(action, current)
			return current
		}

/**
 * 
 * @param contexts 
 * @param action 
 * @returns 
 */
const contextsDecideData = (
	configuration: Pick<ContextSystemConfig, 'strategy_mergeData'>,
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'data' | 'action'>,
): ContextData => {
	const merger = dataMerge(configuration, action)
	return [...contexts]
		.reduce(
			(current: ContextData, { config }): ContextData =>
				([config.data, config.moreData]).reduce<ContextData>(merger, current),
			{},
		)
}

export default contextsDecideData
