import { useState, useEffect, useRef } from 'react'
import './App.css'
import {type User} from './types.d'
import { UserTable } from './components/UserTable'

function App() {
  const [users, setUsers ] = useState<User[]>([]);
  const [showColors, setShowColors ] = useState(false);
  const [sortByCountry, setSortByCountry] = useState(false);
  // useRef para guardar un valor que quiero que se comparta entre renderizados pero que al cambiar, no vuelva a renderizar el componente
  const originalUsers = useRef<User[]>([]);

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const handleSortByCountry = () => {
    setSortByCountry((prevState) => !prevState);
  };

  const handleDelete = (index:string) => {
    const fileredUsers = users.filter((user) => {
      return user.login.uuid !== index;
    })
    setUsers(fileredUsers);
  }

  const handleReset = () => {
    setUsers(originalUsers.current);
  }

  useEffect(() => {
    fetch("https://randomuser.me/api?results=100")
      .then( res => res.json())
      .then( res => {
        setUsers(res.results);
        originalUsers.current = res.results;
      })
      .catch( error => {
        console.log(error);
      })
    return () => {}
  }, [])

  const sortedUsers =
  sortByCountry ?
  // Nuevo método de Javascript
  users.toSorted((a,b) => {
    return a.location.country.localeCompare(b.location.country);
  })
  // [...users].sort((a,b) => {
  //   return a.location.country.localeCompare(b.location.country);
  // })
  : users;

  return (
    <>
    <div className='App'>
        <h1>Prueba Técnica</h1>
        <header>
          <button onClick={toggleColors}>Colorear filas</button>
          <button onClick={handleSortByCountry}>{sortByCountry?"No ordenar por País":"Ordenar por País"}</button>
          <button onClick={handleReset}>Resetear Tabla</button>
        </header>
        <main>
          <UserTable deleteUser={handleDelete} showColors={showColors} users={sortedUsers}/>
        </main>
    </div>
    </>
  )
}

export default App
