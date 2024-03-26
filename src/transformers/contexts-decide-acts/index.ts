import { ContextAction, ContextActsGroup, ContextActsGroupGenerator, ContextConfig, ContextSelector, StoreMetaList } from '@/types/index.types'
import PartialOmit from '@/types/partial-omit'
import selectorMatch from '@/selector'
import { inactiveLog as log } from '@/side-effects/debug-log'
import storeMetaHasType from '../store-meta-has-type'
import { ContextSystemConfig } from '@/types/system.types'

const contextsDecideActs = (
	configuration: Pick<ContextSystemConfig, 'strategy_mergeActs'>,
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'action'>,
): ContextActsGroup => {
	log('contextsDecideActs')
	const firstType = contexts.findIndex(storeMetaHasType)
	const typeAfter = firstType === -1 ? contexts.length : contexts.slice(firstType + 1).findIndex(storeMetaHasType)
	const nextType = typeAfter === -1 ? contexts.length : firstType + 1 + typeAfter
	return contexts.reduce((current: ContextActsGroup, { config }, index): ContextActsGroup => {
		log('contextsDecideActs', { index, config, current })
		const selfConfig = config && (index < nextType)
		const { overrides } = config
		if (!(selfConfig || overrides)) return current

		const selfActs: Array<[ContextSelector,ContextConfig]> = selfConfig && config
			? [['self',config]]
			: []
		const matchingOverrides = Object.entries(overrides || {}).filter(selectorMatch(action.path))
		
		return selfActs.concat(matchingOverrides).reduce(
			(current: ContextActsGroup, [, config]): ContextActsGroup => {
				if (!(config && config.acts)) return current
				let actsGen: ContextActsGroupGenerator

				if (typeof config.acts === 'function') 
					actsGen = config.acts
				else actsGen = configuration.strategy_mergeActs(config.acts)
				
				if (actsGen)
					return actsGen(action, current)
				return current
			},
			current,
		)
	}, {})
}

export default contextsDecideActs
