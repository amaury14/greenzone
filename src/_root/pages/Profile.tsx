import { toast } from '@/components/ui/use-toast'
import { useGetUserById, useUpdateFollow } from '@/lib/react-query/queriesAndMutations'
import { useParams } from 'react-router-dom'
import Loader from '@/components/shared/Loader';
import { Models } from 'appwrite';
import PostCard from '@/components/shared/PostCard';
import { useUserContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Profile = () => {
  const { id } = useParams()

  const { data: userProfile, isLoading, isError: isErrorUser } = useGetUserById(id ?? '')
  const { mutate: updateFollow, isPending: isUpdatingFollow } = useUpdateFollow()
  const { user } = useUserContext()

  const [followed, setIsFollowed] = useState(!!user.follows?.find(item => item === userProfile?.$id))

  const isLoggedUser = userProfile?.$id === user?.id

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateFollow({ loggedUser: user, followUserId: userProfile?.$id ?? '', isFollowed: !followed })
    setIsFollowed(!followed)
  }

  if (isErrorUser) {
    toast({ title: 'Something went wrong.' })
    return
  }

  return (
    <div className='saved-container'>
      {isLoading && !userProfile ? <Loader /> : (
        <div className='flex flex-col flex-1 gap-9 w-full'>
          <div className='flex gap-3 items-center'>
            <img
              src={userProfile?.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt='profile'
              className='h-14 w-14 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='body-bold'>{userProfile?.name}</p>
              <p className='small-regular text-light-3'>{userProfile?.email}</p>
              <p className='small-regular text-light-3'>@{userProfile?.username}</p>
            </div>
            <div className='flex flex-col'>
              {!isLoggedUser && <>
                {isUpdatingFollow ? <Loader /> :
                  <Button type='button' size='sm' className='shad-button_primary px-5' onClick={handleFollow}>
                    {followed ? 'Following' : 'Follow'}
                  </Button>
                }
              </>
              }
            </div>
          </div>
          <div className='flex flex-col'>
            <h2 className='h4-bold md:h3-bold text-left w-full'>{isLoggedUser ? 'My' : 'User'} Posts</h2>
            <ul className='flex flex-col flex-1 w-full gap-3'>
              {userProfile?.posts?.map((post: Models.Document) => (
                <PostCard post={{ ...post, creator: userProfile }} key={post.caption} />
              ))}
            </ul>
          </div>
        </div>
      )
      }
    </div>
  )
}

export default Profile