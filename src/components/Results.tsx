import { useUsers } from "../hooks/useUsers"
const Results = () => {
    const { users } = useUsers();
  return (
    <h3>Cantidad de Usuarios: {users.length}</h3>
  )
}

export default Results