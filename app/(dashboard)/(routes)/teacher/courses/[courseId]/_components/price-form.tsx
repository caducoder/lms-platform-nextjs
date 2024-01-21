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
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Course } from '@prisma/client'
import { formatPrice } from '@/lib/format'

interface PriceFormProps {
  initialData: Course,
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number()
})

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined
    }
  })

  const { isSubmitting, isValid } = form.formState

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
        Preço do curso
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancelar</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Editar valor
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p className={cn(
          "text-sm mt-2",
          !initialData.price && "text-slate-500 italic"
        )}>
          {initialData.price
            ? formatPrice(initialData.price)
            : "Sem preço"
          }
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='number'
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Defina um valor para seu curso"
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

export default PriceForm