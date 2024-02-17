import React from 'react'

import { ContextId } from '@/types/index.types'

const ReactContext = React.createContext<ContextId | null>(null)

export default ReactContext
