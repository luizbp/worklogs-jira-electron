
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { TimerMode } from '../types/configs'



interface ConfigValue {
	timerMode: TimerMode | undefined
  setTimerMode: (timerMode: TimerMode) => void
}

const ConfigContext = createContext<ConfigValue | null>(null)

const ConfigProvider = ({ children }: any) => {
	const [timerMode, setTimerMode] = useState<TimerMode>();
	
	return (
		<ConfigContext.Provider
			value={{
        timerMode,
        setTimerMode
			}}
		>
			{children}
		</ConfigContext.Provider>
	)
}

export function useConfig() {
	const context = useContext(ConfigContext)

	if (!context) {
		throw new Error('useConfig must be used within a ConfigProvider')
	}

	return context
}

export default ConfigProvider
