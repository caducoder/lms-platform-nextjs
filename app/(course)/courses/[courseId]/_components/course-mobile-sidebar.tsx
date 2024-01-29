import { Menu, Sidebar } from 'lucide-react'
import React from 'react'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Course, Chapter, UserProgress } from '@prisma/client';
import CourseSidebar from './course-sidebar';

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  };
  progressCount: number;
}

const CourseMobileSidebar = ({
  course,
  progressCount
}: CourseMobileSidebarProps) => {
  return (
    <div>
      <Sheet>
        <SheetTrigger className='md:hidden pr-4 hover:opacity-75'>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className='p-0 bg-white'>
          <CourseSidebar
            course={course}
            progressCount={progressCount}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default CourseMobileSidebar