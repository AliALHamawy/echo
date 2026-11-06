import ProfilePage from '@/components/myComponents/ProfilePage'
import { ProfileSkeleton } from '@/components/ui/skeletons/ProfileSkeleton'
import { Suspense } from 'react'

interface ProfileRouteProps {
  params: Promise<{ userId: string }>
}

const ProfileRoute = async ({ params }: ProfileRouteProps) => {
  const { userId } = await params

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePage profileUserId={userId} />
    </Suspense>
  )
}

export default ProfileRoute