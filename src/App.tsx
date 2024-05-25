import { useState, useEffect, useRef, useMemo } from 'react'
import './App.css'
import {type User} from './types.d'
import { UserTable } from './components/UserTable'

function App() {
  const [users, setUsers ] = useState<User[]>([]);
  const [showColors, setShowColors ] = useState(false);
  const [sortByCountry, setSortByCountry] = useState(false);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

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

  const sortUsers = (users: User[]) => {
    console.log("Sort Users");
      return sortByCountry ?
      // Nuevo método de Javascript
      users.toSorted((a,b) => {
        return a.location.country.localeCompare(b.location.country);
      })
      // [...users].sort((a,b) => {
      //   return a.location.country.localeCompare(b.location.country);
      // })
      : users;
  }

  const filteredUsers = useMemo(()=> {
    console.log("filteredUsers");
    return filterCountry !== null && filterCountry.length > 0
    ? users.filter((user) => {
      return user.location.country.toLowerCase().includes(filterCountry.toLowerCase());
    })
    : users;},[users, filterCountry]);

  const sortedUsers = useMemo(()=>{return sortUsers(filteredUsers)}, [filteredUsers, sortByCountry]);

  return (
    <>
    <div className='App'>
        <h1>Prueba Técnica</h1>
        <header style={{display: "flex", alignItems:"center", justifyContent: "center", gap: "1rem"}}>
          <button onClick={toggleColors}>Colorear filas</button>
          <button onClick={handleSortByCountry}>{sortByCountry?"No ordenar por País":"Ordenar por País"}</button>
          <button onClick={handleReset}>Resetear Tabla</button>
          <input style={{width: "12rem", height:"2rem",marginLeft:"1rem"}} type="text" placeholder='Filtro por país' onChange={(e)=>{
            setFilterCountry(e.target.value.trim());
          }}/>
        </header>
        <main>
          <UserTable deleteUser={handleDelete} showColors={showColors} users={sortedUsers}/>
        </main>
    </div>
    </>
  )
}

export default App
