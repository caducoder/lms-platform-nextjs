import React from 'react'
import Sidebar from './_components/sidebar'
import Navbar from './_components/navbar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full flex flex-row'>
      <div className='hidden md:flex h-full w-56 flex-col inset-y-0 z-50'>
        <Sidebar />
      </div>
      <main className='w-full'>
        <div className='h-[80px] w-full z-50 inset-y-0'>
          <Navbar />
        </div>
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout