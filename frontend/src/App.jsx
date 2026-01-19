import { useState, useEffect } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  // Theme State
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    // Apply theme to document body
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <Dashboard theme={theme} />
      </main>
    </>
  )
}

export default App
