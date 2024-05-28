export const fetchUsers = async (page: number) => {
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