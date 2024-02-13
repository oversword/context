import {
	ContextAction,
	ContextData,
	ContextDataGenerator,
	StoreMetaList,
} from 'types/index.types'
import PartialOmit from 'types/partial-omit'

const dataMerge =
	(action: PartialOmit<ContextAction, 'data' | 'action'>) =>
		(current: ContextData, data: undefined | ContextData | ContextDataGenerator): ContextData => {
			if (!data) return current
			if (typeof data === 'function') return data(action, current)
			Object.assign(current, data)
			return current
		}

/**
 * 
 * @param contexts 
 * @param action 
 * @returns 
 */
const contextsDecideData = (
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'data' | 'action'>,
): ContextData => {
	const merger = dataMerge(action)
	return [...contexts]
		.reverse()
		.reduce(
			(current: ContextData, { config }): ContextData =>
				([config.data, config.moreData]).reduce<ContextData>(merger, current),
			{},
		)
}

export default contextsDecideData
