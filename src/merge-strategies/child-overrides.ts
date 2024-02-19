import { ContextAction } from '@/types/index.types'

const childOverrides = <T extends object = object>(child: T) => (_action: ContextAction, parent: T): T => ({
	...parent,
	...child,
})

export default childOverrides