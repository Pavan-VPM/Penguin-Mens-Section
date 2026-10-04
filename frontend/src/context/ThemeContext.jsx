import React, { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const theme = 'light'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
    try {
      localStorage.removeItem('penguin_theme')
    } catch (e) {}
  }, [])

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
