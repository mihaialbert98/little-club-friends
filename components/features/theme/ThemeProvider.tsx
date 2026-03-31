'use client'

import { createContext, useContext, useEffect } from 'react'

type Theme = 'WINTER' | 'SUMMER'

const ThemeContext = createContext<Theme>('WINTER')

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode
  initialTheme: Theme
}) {
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      initialTheme.toLowerCase()
    )
  }, [initialTheme])

  return (
    <ThemeContext.Provider value={initialTheme}>
      <div data-theme={initialTheme.toLowerCase()}>{children}</div>
    </ThemeContext.Provider>
  )
}
