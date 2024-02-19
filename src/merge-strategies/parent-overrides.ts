import { ContextAction } from "@/types/index.types"

const parentOverrides = <T extends object = object>(child: T) => (_action: ContextAction, parent: T): T => ({
  ...child,
  ...parent,
})

export default parentOverrides