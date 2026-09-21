"use client"

import SettibgCard from '@/components/myComponents/SettibgCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { pb } from '@/lib/pocketbase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SecuritySettings = () => {
  const router = useRouter()
  const user = pb.authStore.record
  const username = user?.username || user?.userName || ''
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleSignOut = () => {
    pb.authStore.clear()
    router.replace('/auth')
  }

  const closeDeleteDialog = () => {
    if (isDeleting) return
    setIsDeleteOpen(false)
    setConfirmation('')
    setDeleteError('')
  }

  const handleDeleteAccount = async () => {
    if (!user || confirmation !== username) return

    setDeleteError('')
    setIsDeleting(true)

    try {
      const userPosts = await pb.collection('posts').getFullList({
        filter: `author = "${user.id}"`,
        requestKey: null,
      })

      await Promise.all(userPosts.map((post) => pb.collection('posts').delete(post.id)))
      await pb.collection('users').delete(user.id)
      pb.authStore.clear()
      router.replace('/auth')
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Unable to delete your account.')
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex flex-col w-full border border-muted divide-y">
        <SettibgCard labelHeading="Email address">
          <Input className='w-50 rounded-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus:outline-none' placeholder='example@gmail.com' />
        </SettibgCard>
        <SettibgCard labelHeading="Password" labelDescription='Change the password used to sign in.'>
          <Button className='w-fit p-2 rounded-none text-xs'>Change</Button>
        </SettibgCard>
      </div>
      <span className="text-xs uppercase text-muted-foreground m-0 p-0 ">Session</span>
      <div className="flex flex-col w-full border border-muted divide-y">
        <SettibgCard labelHeading="Sign out" labelDescription='Sign out of Echo on this device.'>
          <Button type='button' onClick={handleSignOut} className='w-fit p-2 rounded-none text-xs bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground/80 border border-foreground/20'><LogOut />Sign out</Button>
        </SettibgCard>
      </div>
      <span className="text-xs uppercase text-muted-foreground m-0 p-0 ">Danger zone</span>
      <div className="flex flex-col w-full border border-red-500/30 divide-y">
        <SettibgCard labelHeading="Delete account" labelDescription='Permanently remove your account and all data.'>
          <Button type="button" onClick={() => setIsDeleteOpen(true)} className='w-fit p-2 rounded-none text-xs bg-destructive/75 transition-colors duration-75 hover:bg-destructive/90 text-foreground hover:text-foreground/80 border'><LogOut />Delete account</Button>
        </SettibgCard>
      </div>

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
          <div className="w-full max-w-md border border-destructive/40 bg-background p-6 shadow-xl">
            <div className="flex flex-col gap-2">
              <h2 id="delete-account-title" className="text-lg font-semibold">Delete account?</h2>
              <p className="text-sm text-muted-foreground">
                This permanently deletes your account and all of its data. This action cannot be undone.
              </p>
              <p className="text-sm text-foreground">
                Type <span className="font-semibold">{username}</span> to confirm.
              </p>
              <Input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder={username}
                autoFocus
                disabled={isDeleting}
                className="mt-2 rounded-none"
              />
              {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={closeDeleteDialog} disabled={isDeleting} className="rounded-none">
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => void handleDeleteAccount()}
                  disabled={!username || confirmation !== username || isDeleting}
                  className="rounded-none"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SecuritySettings