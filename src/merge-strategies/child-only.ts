import { ContextAction } from "@/types/index.types"

const childOnly = <T extends object = object>(child: T) => (_action: ContextAction, _parent: T): T => ({
  ...child,
})

export default childOnly