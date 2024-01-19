"use client"

import React from 'react'
import * as z from "zod"
import axios from 'axios'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
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
import Link from 'next/link'
import toast from "react-hot-toast"

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Título é obrigatório",
  })
})

const CreatePage = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    }
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      const response = await axios.post("/api/courses", values)
      router.push(`/teacher/courses/${response.id}`)
    } catch {
      toast.error("Erro inesperado.")
    }
  }

  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
      <div>
        <h1 className='text-2xl'>
          Nome do curso
        </h1>
        <p className='text-sm text-slate-600'>
          Como você gostaria de chamar o seu curso?
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 mt-8'
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título do curso
                  </FormLabel>
                  <FormControl>
                    <Input 
                      disabled={isSubmitting}
                      placeholder="ex. 'Comunicação Empresarial'"
                      {...field}
                    />
                    
                  </FormControl>
                  <FormDescription>
                      O que você vai ensinar neste curso?
                    </FormDescription>
                    <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
                <Link href="/">
                  <Button
                    type="button"
                    variant="ghost"
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  Continuar
                </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreatePage