"use client"

import React, { useState } from 'react'
import * as z from "zod"
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { Loader2, Pencil, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Chapter, Course } from '@prisma/client'
import ChaptersList from './chapters-list'

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] },
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1)
})

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false);
  const toggleCreating = () => setIsCreating((current) => !current)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    }
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values)
      toast.success("Capítulo criado")
      toggleCreating()
      router.refresh()
    } catch {
      toast.error("Erro inesperado.")
    }
  }

  const onReorder = async (updatedData: { id: string, position: number }[]) => {
    try {
      setIsUpdating(true)

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updatedData
      })
      toast.success("Capítulos reordenados")
      router.refresh()
    } catch (error) {
      toast.error("Algo deu errado")
    } finally {
      setIsUpdating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
      {isUpdating && (
        <div className="absolute top-0 right-0 h-full w-full bg-slate-500/20 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Capítulos do curso
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancelar</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Adicionar um capítulo
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Escolha um título"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              Criar
            </Button>

          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.chapters.length && "text-slate-500 italic"
        )}>
          {!initialData.chapters.length && "Sem capítulos"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <div className='text-xs text-muted-foreground mt-4'>
          Arraste para reordenar os capítulos
        </div>
      )}
    </div>
  )
}

export default ChaptersForm