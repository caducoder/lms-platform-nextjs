"use client"

import React, { useState } from 'react'
import * as z from "zod"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

import toast from 'react-hot-toast'
import { PlusCircle, File, Loader2, X } from 'lucide-react'

import { Attachment, Course } from '@prisma/client'
import { FileUpload } from '@/components/file-upload'

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] },
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1)
})

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toggleEdit = () => setIsEditing((current) => !current)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values)
      toast.success("Curso atualizado")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Erro inesperado.")
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
      toast.success("Anexo removido")
      router.refresh()
    } catch (error) {
      toast.error("Algo deu errado")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className="font-medium flex items-center justify-between">
        Anexos do curso
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing && (
            <>Cancelar</>
          )}
          {!isEditing && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Adicionar arquivo
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <>
          {initialData.attachments.length === 0 && (
            <p className='text-sm mt-2 text-slate-500 italic'>
              Sem anexos
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attc) => (
                <div
                  key={attc.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className='text-sm line-clamp-1'>{attc.name}</p>
                  {deletingId === attc.id && (
                    <div className='ml-auto'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                    </div>
                  )}
                  {deletingId !== attc.id && (
                    <button
                      onClick={() => onDelete(attc.id)}
                      className='ml-auto hover:opacity-75 transition'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url })
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Adicione conteúdos que seus estudantes podem precisar para completar o curso.
          </div>
        </div>
      )}
    </div>
  )
}

export default AttachmentForm