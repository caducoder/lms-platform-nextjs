import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import React from 'react'

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; } }
) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const { list } = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    })

    // não permite criar um capítulo no curso de outra pessoa
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    for(let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position }
      })
    }

    return new NextResponse("Success", { status: 200 })
  } catch (error) {
    console.log("[REORDER]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
