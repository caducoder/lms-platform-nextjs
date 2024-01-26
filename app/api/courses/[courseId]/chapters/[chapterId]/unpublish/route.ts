import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string, chapterId: string } }
){
  try {
    const { userId } = auth()
    const { courseId, chapterId } = params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId
      }
    })
    
    // não permite atualizar capítulo no curso de outra pessoa
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: false
      }
    })

    // despublica o curso inteiro se esse for o único cap publicado
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true
      }
    })

    if(!publishedChaptersInCourse.length) {
      // despublica o curso
      await db.course.update({
        where: {
          id: courseId
        },
        data: {
          isPublished: false
        }
      })
    }

    return NextResponse.json(unpublishedChapter)
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}