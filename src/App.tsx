import { useState, useEffect } from 'react'
import './App.css'
import {type User} from './types.d'
import { UserTable } from './components/UserTable'

function App() {
  const [users, setUsers ] = useState<User[]>([]);
  const [showColors, setShowColors ] = useState(false);

  const toggleColors = () => {
    setShowColors(!showColors);
  }
  useEffect(() => {
    fetch("https://randomuser.me/api?results=10")
      .then( res => res.json())
      .then( res => {
        setUsers(res.results)
      })
      .catch( error => {
        console.log(error)
      })
    return () => {}
  }, [])

  return (
    <>
    <div className='App'>
        <h1>Prueba Técnica</h1>
        <header>
          <button onClick={toggleColors}>Colorear filas</button>
        </header>
        <main>
          <UserTable showColors={showColors} users={users}/>
        </main>
    </div>
    </>
  )
}

export default App
