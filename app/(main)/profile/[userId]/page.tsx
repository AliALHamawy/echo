import ProfilePage from '@/components/myComponents/ProfilePage'

interface ProfileRouteProps {
  params: Promise<{ userId: string }>
}

const ProfileRoute = async ({ params }: ProfileRouteProps) => {
  const { userId } = await params

  return <ProfilePage profileUserId={userId} />
}

export default ProfileRoute