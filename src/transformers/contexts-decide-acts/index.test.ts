import contextsDecideActs from '.'
import {expect, describe, test} from '@jest/globals'
import { ContextAction, StoreMeta } from '@/types/index.types'
import defaultConfiguration from '@/system/default-config'

const defaultStoreContext = {
	outercept: {},
	intercept: {},
	id: '0',
	root: true,
	parent: null,
	data: null,
}
describe('contextsDecideActs', () => {
	test('returns the acts options when defined in a context', () => {
		const actionObject = {
			uniqueKey: 'test'
		}
		const result = contextsDecideActs(defaultConfiguration, [{
			...defaultStoreContext,
			config: {
				type: 'contextType',
				acts: {
					actionName: actionObject
				}
			},
		} as StoreMeta], {path:['contextType']} as ContextAction)

		expect(result).toEqual({
			actionName: actionObject
		})
	})
	test('Parent overrides Child: merges and overrides acts configs when defined in both the parent and child', () => {
		const result = contextsDecideActs(defaultConfiguration, [{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				acts: {
					actionName: {
						childKey: 'test'
					}
				}
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				overrides: {
					contextType: {
						acts: {
							actionName: {
								childKey: 'override',
								parentKey: 'merge',
							}
						}
					}
				}
			},
		} as StoreMeta], {path:['parentType', 'contextType']} as ContextAction)

		expect(result).toEqual({
			actionName: {
				childKey: 'override',
				parentKey: 'merge',
			}
		})
	})
	test('merges and overrides acts configs when defined in both the parent and child, with a strict relationship that is met', () => {
		const result = contextsDecideActs(defaultConfiguration, [{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				acts: {
					actionName: {
						childKey: 'test'
					}
				}
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				overrides: {
					'parentType > contextType': {
						acts: {
							actionName: {
								childKey: 'override',
								parentKey: 'merge',
							}
						}
					}
				}
			},
		} as StoreMeta], {path:['parentType', 'contextType']} as ContextAction)

		expect(result).toEqual({
			actionName: {
				childKey: 'override',
				parentKey: 'merge',
			}
		})
	})
	test('does not merge acts configs when defined in both the parent and child, with a strict relationship that is not met', () => {
		const result = contextsDecideActs(defaultConfiguration, [{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '2',
			config: {
				type: 'contextType',
				acts: {
					actionName: {
						childKey: 'test'
					}
				}
			},
		} as StoreMeta, {
			...defaultStoreContext,
			id: '2',
			root: false,
			parent: '0',
			config: {
				type: 'indirectType',
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				overrides: {
					'parentType > contextType': {
						acts: {
							actionName: {
								childKey: 'override',
								parentKey: 'merge',
							}
						}
					}
				}
			},
		} as StoreMeta], {path:['parentType', 'indirectType', 'contextType']} as ContextAction)

		expect(result).toEqual({
			actionName: {
				childKey: 'test'
			}
		})
	})
	test('calls acts generation methods, child first when provided', () => {
		const parentActs = {
			actionName: {
				parentKey: 'test',
			}
		}
		const childActs = {
			actionName: {
				childKey: 'test'
			}
		}
		const contextActsGen = jest.fn().mockReturnValue(childActs)
		const parentActsGen = jest.fn().mockReturnValue(parentActs)
		const action = {path:['parentType', 'contextType']} as ContextAction
		const result = contextsDecideActs(defaultConfiguration, [{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				acts: contextActsGen
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				overrides: {
					'parentType contextType': {acts: parentActsGen}
				}
			},
		} as StoreMeta], action)

		expect(result).toEqual(parentActs)
		expect(parentActsGen).toHaveBeenCalledTimes(1)
		expect(contextActsGen).toHaveBeenCalledTimes(1)
		expect(contextActsGen).toBeCalledWith(action, {})
		expect(parentActsGen).toBeCalledWith(action, childActs)
	})
})