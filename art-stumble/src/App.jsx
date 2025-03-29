import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ArtDisplay from './components/ArtDisplay'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div><ArtDisplay/></div>
      
    </>
  )
}

export default App
