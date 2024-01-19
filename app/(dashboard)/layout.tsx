import React from 'react'
import Sidebar from './_components/sidebar'
import Navbar from './_components/navbar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-screen flex flex-row overflow-hidden'>
      <div className='hidden md:flex h-full w-56 flex-col inset-y-0 z-50'>
        <Sidebar />
      </div>
      <main className='w-screen flex flex-col'>
        <div className='h-[80px] w-full z-50 inset-y-0'>
          <Navbar />
        </div>
        <div className='flex-1 overflow-y-auto'>
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout