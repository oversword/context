import React from 'react'

import { ContextSystemApi } from 'types/system.types'

const SystemContext = React.createContext<ContextSystemApi | null>(null)

export default SystemContext
