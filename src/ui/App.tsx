import { useEffect } from 'react'

import './App.css'
import DeviceCard from './molecules/DeviceCard'

const App = () => {
  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      if (prefersDarkScheme.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    prefersDarkScheme.addEventListener('change', applyTheme)
    // console.log(window.matchMedia('(prefers-color-scheme: dark)'))
    applyTheme()
    return () => {
      prefersDarkScheme.removeEventListener('change', applyTheme)
    }
  }, [])

  return (
    <div className="m-0 p-0 bg-background">
      <div className="p-4 dark:text-red-600 flex flex-col items-center justify-center">This is the plugin</div>
      <DeviceCard />
    </div>
  )
}

export default App
