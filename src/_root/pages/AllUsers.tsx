import Loader from '@/components/shared/Loader'
import UserCard from '@/components/shared/UserCard'
import { useToast } from '@/components/ui/use-toast'
import { useUserContext } from '@/context/AuthContext'
import { useGetUsers } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'

const AllUsers = () => {
  const { toast } = useToast()

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers()
  const { user: loggedUser } = useUserContext()

  if (isErrorCreators) {
    toast({ title: 'Something went wrong.' })
    return
  }

  const isFollowed = (creator: Models.Document) => {
    return !!loggedUser?.follows?.find(userId => userId === creator?.$id)
  }

  return (
    <div className='common-container'>
      <div className='user-container'>
        <h2 className='h3-bold md:h2-bold text-left w-full'>All Users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className='user-grid'>
            {creators?.documents?.map((creator) => (
              <li key={creator?.$id} className='flex-1 min-w-[200px] w-full'>
                <UserCard user={creator} isFollowed={isFollowed(creator)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AllUsers