import SettibgCard from '@/components/myComponents/SettibgCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

const SecuritySettings = () => {
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
          <Button className='w-fit p-2 rounded-none text-xs bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground/80 border border-foreground/20'><LogOut />Sign out</Button>
        </SettibgCard>
      </div>
      <span className="text-xs uppercase text-muted-foreground m-0 p-0 ">Danger zone</span>
      <div className="flex flex-col w-full border border-red-500/30 divide-y">
        <SettibgCard labelHeading="Delete account" labelDescription='Permanently remove your account and all data.'>
          <Button className='w-fit p-2 rounded-none text-xs bg-destructive/75 transition-colors duration-75 hover:bg-destructive/90 text-foreground  hover:text-foreground/80 border'><LogOut />Delete account</Button>
        </SettibgCard>
      </div>
    </>
  )
}

export default SecuritySettings