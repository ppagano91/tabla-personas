import {fetchUsers} from '../services/users';
import { useInfiniteQuery } from '@tanstack/react-query';
import {type User} from '../types.d';

export const useUsers = () => {
    const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery<{nextCursor?: number, users:User[]}>(    
        {
         queryKey: ['users'],
         queryFn: ({pageParam = 1}) => fetchUsers(Number(pageParam)),
         getNextPageParam: (lastPage) => lastPage.nextCursor,
         initialPageParam: 1,
         refetchOnWindowFocus: false
       }
    )

    return { 
        refetch,
        fetchNextPage,
        isLoading,
        isError,
        users: data?.pages?.flatMap(page => page.users) ?? [],
        hasNextPage
    }
}