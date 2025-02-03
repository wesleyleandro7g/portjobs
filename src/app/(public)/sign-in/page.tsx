'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import nookies from 'nookies'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@/contexts/user-context'
import { supabase } from '@/db/supabase/client'

const formSchema = z.object({
  email: z.string().email('Insira um email válido'),
  password: z.string().min(6, 'Insira sua senha'),
})

export default function SignIn() {
  const router = useRouter()
  const { toast } = useToast()
  const { setUser } = useUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return toast({
        title: 'Oops! Erro ao iniciar sessão',
        description: error.message,
      })
    }

    const user = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata.name,
      type: data.user.user_metadata.type,
    }

    setUser(user)

    nookies.set(null, '@portjobs.user.id', user?.id || '')
    nookies.set(null, '@portjobs.user.type', user?.type || '')
    nookies.set(null, '@portjobs.user.name', user?.name || '')
    nookies.set(null, '@portjobs.user.email', user?.email || '')

    if (user.type === 'empresa') {
      router.push('/painel')
    } else {
      router.push('/vagas')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-white md:bg-background'>
          <Card className='w-full p-0 md:p6 md:max-w-[380px] bg-white shadow-none md:shadow-md border-none'>
            <CardHeader>
              <CardTitle className='text-3xl'>Iniciar sessão</CardTitle>
              <CardDescription>
                Insira login e senha para acessar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid w-full items-center gap-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='Seu email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Insira sua senha'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className='flex flex-col items-center text-center gap-2'>
              <Button type='submit' className='text-white w-full'>
                Iniciar seção
              </Button>
              <span className='text-xs text-text'>
                Não possui conta?{' '}
                <Link href='/sign-up'>
                  <span className='underline'>Crie uma conta agora</span>
                </Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  )
}
