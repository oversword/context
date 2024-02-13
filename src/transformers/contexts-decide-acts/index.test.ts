import contextsDecideActs from '.'
import {expect, describe, test} from '@jest/globals'
import { ContextAction, StoreMeta } from 'types/index.types'

const defaultStoreContext = {
	outercept: {},
	intercept: {},
	id: '0',
	root: true,
	parent: null,
}
describe('contextsDecideActs', () => {
	test('returns the acts options when defined in a context', () => {
		const actionObject = {
			uniqueKey: 'test'
		}
		const result = contextsDecideActs([{
			...defaultStoreContext,
			config: {
				type: 'contextType',
				acts: {
					contextType: {
						actionName: actionObject
					}
				}
			},
		} as StoreMeta], {path:['contextType']} as ContextAction)

		expect(result).toEqual({
			actionName: actionObject
		})
	})
	test('Parent overrides Child: merges and overrides acts configs when defined in both the parent and child', () => {
		const result = contextsDecideActs([{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				acts: {
					contextType: {
						actionName: {
							childKey: 'test'
						}
					}
				}
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				acts: {
					contextType: {
						actionName: {
							childKey: 'override',
							parentKey: 'merge',
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
		const result = contextsDecideActs([{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				acts: {
					contextType: {
						actionName: {
							childKey: 'test'
						}
					}
				}
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				acts: {
					'parentType > contextType': {
						actionName: {
							childKey: 'override',
							parentKey: 'merge',
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
		const result = contextsDecideActs([{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '2',
			config: {
				type: 'contextType',
				acts: {
					contextType: {
						actionName: {
							childKey: 'test'
						}
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
				acts: {
					'parentType > contextType': {
						actionName: {
							childKey: 'override',
							parentKey: 'merge',
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
		const result = contextsDecideActs([{
			...defaultStoreContext,
			id: '1',
			root: false,
			parent: '0',
			config: {
				type: 'contextType',
				acts: {
					contextType: contextActsGen
				}
			},
		} as StoreMeta, {
			...defaultStoreContext,
			config: {
				type: 'parentType',
				acts: {
					'parentType contextType': parentActsGen
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