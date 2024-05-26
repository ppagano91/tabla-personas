import {SortBy, type User} from '../types.d'
interface Props {
    users: User[]
    showColors: boolean
    deleteUser:(index:string) => void
    changeSorting:(sort:SortBy) => void
}

export function UserTable({users, showColors, deleteUser, changeSorting}: Props){
    return (
        <table width="100%">
            <thead>
                <th>Foto</th>
                <th className='pointer' onClick={()=>changeSorting(SortBy.NAME)}>Nombre</th>
                <th className='pointer' onClick={()=>changeSorting(SortBy.LAST)}>Apellido</th>
                <th className='pointer' onClick={()=>changeSorting(SortBy.COUNTRY)}>País</th>
                <th>Acciones</th>
            </thead>
            <tbody className={showColors?"table-colors":"table"}>
                {users.map((user)=>{
                    // const backgroundColor = index % 2 === 0 ? "#333":"#555";
                    // const color = showColors ? backgroundColor : "transparent";

                    return (
                        <tr key={user.login.uuid}>
                            <td>
                                <img src={user.picture.thumbnail} alt="" />
                            </td>
                            <td>{user.name.first}</td>
                            <td>{user.name.last}</td>
                            <td>{user.location.country}</td>
                            <td>
                                <button type="button" className='btn btn-primary' onClick={()=>{deleteUser(user.login.uuid)}}>Eliminar</button>
                            </td>

                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}