import {createContext , ReactNode, useState, useContext, useEffect} from 'react'

type Theme = 'light' | 'dark'

interface IThemeContextData  {
  theme : Theme;
  toogleTheme : () => void;
}
type IThemeProvider = {
  children : ReactNode
}
const ThemeContext = createContext({} as IThemeContextData)

export function ThemeProvider({children} :IThemeProvider){

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const theme = localStorage.getItem('theme')

    return (theme ?? 'light') as Theme;
  })

  useEffect(() => {
    localStorage.setItem('theme' , currentTheme)
  },[currentTheme])

  function toogleTheme() {
    
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')
  }

  return(
    <ThemeContext.Provider value={{theme : currentTheme, toogleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  return context;
}