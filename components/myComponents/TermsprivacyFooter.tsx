import Link from 'next/link'
import React from 'react'

const TermsprivacyFooter = () => {
  return (
    <div className='footer border-t border-border p-2 pt-4 pb-8 flex  w-full text-center text-sm text-muted-foreground items-center justify-center'>Questions about this page? <Link href="/" className='text-primary border-b border-primary ml-[2px]'> Return to Echo</Link></div>
  )
}

export default TermsprivacyFooter