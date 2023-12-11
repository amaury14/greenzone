import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import Loader from './Loader'
import { useUpdateFollow } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import { useState } from 'react'

type UserCardProps = {
  user: Models.Document
  isFollowed: boolean
}

const UserCard = ({ user, isFollowed }: UserCardProps) => {
  const { user: loggedUser } = useUserContext()

  const { mutate: updateFollow, isPending: isUpdatingFollow } = useUpdateFollow()

  const [followed, setIsFollowed] = useState(isFollowed)

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateFollow({ loggedUser, followUserId: user.$id, isFollowed: !isFollowed })
    setIsFollowed(!isFollowed)
  }
  return (
    <Link to={`/profile/${user.$id}`} className='user-card'>
      <img
        src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
        alt='creator'
        className='rounded-full w-14 h-14'
      />

      <div className='flex-center flex-col gap-1'>
        <p className='base-medium text-light-1 text-center line-clamp-1'>
          {user.name}
        </p>
        <p className='small-regular text-light-3 text-center line-clamp-1'>
          @{user.username}
        </p>
      </div>

      {isUpdatingFollow ? <Loader /> :
        <Button type='button' size='sm' className='shad-button_primary px-5' onClick={handleFollow}>
          {followed ? 'Following' : 'Follow'}
        </Button>
      }
    </Link>
  )
}

export default UserCard