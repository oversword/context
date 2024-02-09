import { ContextAction, ContextActsGroup, StoreMetaList } from '../../types/index.types'
import PartialOmit from '../../types/partial-omit'
import selectorMatch from '../../selector'

const contextsDecideActs = (
	contexts: StoreMetaList,
	action: PartialOmit<ContextAction, 'action'>,
): ContextActsGroup =>
	contexts.reduce((current: ContextActsGroup, { config }): ContextActsGroup => {
		const { acts } = config
		if (!acts) return current

		const matchingActs = Object.entries(acts).filter(selectorMatch(action.path))
		return matchingActs.reduce(
			(current: ContextActsGroup, [, actsGen]): ContextActsGroup => {
				if (typeof actsGen === 'function') return actsGen(action, current)
				Object.entries(actsGen).forEach(([actionName, options]) => {
					if (actionName in current) {
						current[actionName] = {
							...current[actionName],
							...options,
						}
					} else {
						current[actionName] = options
					}
				})
				return current
			},
			current,
		)
	}, {})

export default contextsDecideActs
