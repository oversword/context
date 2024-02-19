import { ContextAction } from '@/types/index.types'

const parentOnly = <T extends object = object>(_child: T) => (_action: ContextAction, parent: T): T => ({
	...parent,
})

export default parentOnly