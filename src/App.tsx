import { useState, useMemo } from 'react'
import './App.css'
import {SortBy, type User} from './types.d'
import { UserTable } from './components/UserTable'
import { useInfiniteQuery } from '@tanstack/react-query'

const fetchUsers = async (page: number) => {
  return await fetch(`https://randomuser.me/api?results=10&seed=dev&page=${page}`)
      .then( res => {
        if(!res.ok) throw new Error("Error en la petición");
        return res.json()}
      )
      .then(res => {
        const currentPage = Number(res.info.page);
        const nextCursor = currentPage > 10 ? undefined: currentPage + 1;
        
        return {
          users: res.results,
          nextCursor: nextCursor
        }
      })
}

function App() {
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery<{nextCursor?: number, users:User[]}>(    
   {
    queryKey: ['users'],
    queryFn: ({pageParam = 1}) => fetchUsers(Number(pageParam)),
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => lastPage.nextCursor,
    initialPageParam: 1,
  }
)  
  const users: User[] = data?.pages?.flatMap(page => page.users) ?? [];

  const [showColors, setShowColors ] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  // useRef para guardar un valor que quiero que se comparta entre renderizados pero que al cambiar, no vuelva a renderizar el componente
  // const originalUsers = useRef<User[]>([]);

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const handleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue);
  };

  const handleDelete = (index:string) => {
    const fileredUsers = users.filter((user) => {
      return user.login.uuid !== index;
    })
    // setUsers(fileredUsers);
  }

  const handleReset = async () => {
    await refetch();
  }

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  }


  const sortUsers = (users: User[]) => {
      return sorting == SortBy.COUNTRY ?
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
    return filterCountry !== null && filterCountry.length > 0
    ? users.filter((user) => {
      return user.location.country.toLowerCase().includes(filterCountry.toLowerCase());
    })
    : users;},[users, filterCountry]);

  const sortedUsers = useMemo(()=>{
    if (sorting === SortBy.NONE) return filteredUsers;
    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,
    };

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    })
    /*if (sorting === SortBy.NONE) return filteredUsers;

    let sortedFn = (a:User, b:User) => a.location.country.localeCompare(b.location.country);

    if (sorting == SortBy.NAME){
      sortedFn = (a, b) => a.name.first.localeCompare(b.name.first);
    }

    if (sorting == SortBy.LAST){
      sortedFn = (a, b) => a.name.last.localeCompare(b.name.last);
    }

    return filteredUsers.toSorted(sortedFn);*/

  }, [filteredUsers, sorting]);

  return (
    <>
    <div className='App'>
        <h1>Prueba Técnica</h1>
        <header style={{display: "flex", alignItems:"center", justifyContent: "center", gap: "1rem"}}>
          <button onClick={toggleColors}>Colorear filas</button>
          <button onClick={handleSortByCountry}>{sorting == SortBy.COUNTRY ?"No ordenar por País":"Ordenar por País"}</button>
          <button onClick={handleReset}>Resetear Tabla</button>
          <input style={{width: "12rem", height:"2rem",marginLeft:"1rem"}} type="text" placeholder='Filtro por país' onChange={(e)=>{
            setFilterCountry(e.target.value.trim());
          }}/>
        </header>
        <main>
          {users.length > 0 &&
            <UserTable
            changeSorting={handleChangeSort}
            deleteUser={handleDelete}
            showColors={showColors}
            users={sortedUsers}
            />
        }
          {isLoading && <p>Cargando...</p>}
          {!isLoading && isError && <p>Ha ocurrido un error</p>}
          {!isLoading && !isError && users.length === 0 && <p>No hay resultados</p>}
          {!isLoading && !isError && hasNextPage === true && <button onClick={() => fetchNextPage()}>Cargar más resultados</button>}
          {!isLoading && !isError && hasNextPage === true && <p>FIN</p>}
        </main>
    </div>
    </>
  )
}

export default App
