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
import { Pencil } from 'lucide-react'

interface ChapterTitleFormProps {
  initialData: {
    title: string;
  },
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1)
})

const ChapterTitleForm = ({ initialData, courseId, chapterId }: ChapterTitleFormProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
      toast.success("Capítulo atualizado")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Erro inesperado.")
    }
  }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className="font-medium flex items-center justify-between">
        Título do capítulo
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancelar</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Editar título
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p className="text-sm">
          {initialData.title}
        </p>
      ) : (
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
                      placeholder="ex. 'Introdução ao curso'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2 mt-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ChapterTitleForm