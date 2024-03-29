"use client"

import React, { useState } from 'react'
import * as z from "zod"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

import toast from 'react-hot-toast'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'

import { Course } from '@prisma/client'
import Image from 'next/image'
import { FileUpload } from '@/components/file-upload'

interface ImageFormProps {
  initialData: Course,
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Imagem é obrigatória",
  })
})

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success("Curso atualizado")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Erro inesperado.")
    }
  }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className="font-medium flex items-center justify-between">
        Imagem do curso
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && (
            <>Cancelar</>
          )}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Adicionar imagem
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Editar imagem
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className='h-10 w-10 text-slate-500'/>
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if(url) {
                onSubmit({ imageUrl: url })
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect radio recommended
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageForm