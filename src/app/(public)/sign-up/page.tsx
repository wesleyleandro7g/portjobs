'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import nookies from 'nookies'

import { useUser } from '@/contexts/user-context'

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

import { formSchema, userTypes } from './utils'

import { supabase } from '@/db/supabase/client'

export default function SignIn() {
  const router = useRouter()
  const { setUser } = useUser()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      type: 'profissional',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          name: values.name,
          type: values.type,
        },
      },
    })

    if (error) {
      toast({
        title: 'Oops! Erro ao criar conta',
        description: 'Verifique seus dados e tente novamente',
      })
      return console.log(error)
    }

    toast({
      title: 'Conta criada com sucesso!',
      description: 'Você será redirecionado para o painel',
    })

    setUser({
      id: data.user?.id,
      name: values.name,
      email: values.email,
      type: values.type,
    })

    nookies.set(null, '@portjobs.user.id', data.user?.id || '')
    nookies.set(null, '@portjobs.user.type', values.type)
    nookies.set(null, '@portjobs.user.name', values.name)
    nookies.set(null, '@portjobs.user.email', values.email)

    if (values.type === 'empresa') {
      router.push('/painel')
    } else {
      router.push('/vagas')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
          <Card className='w-full max-w-[380px] bg-white border-none'>
            <CardHeader>
              <CardTitle className='text-3xl'>Criar conta</CardTitle>
              <CardDescription>Crie sua conta gratuitamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid w-full items-center gap-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Seu nome ou nome da empresa'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <div className='space-y-1'>
                  <span className='text-text text-sm font-medium'>
                    Tipo de acesso
                  </span>
                  <FormField
                    control={form.control}
                    name='type'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className='grid grid-cols-2 gap-2 md:gap-4 w-full'>
                            {userTypes.map((user) => (
                              <label
                                key={user.id}
                                className='flex flex-col items-center justify-center w-full p-4 rounded-lg gap-1 bg-primary/10 cursor-pointer font-semibold text-sm text-primary data-[checked=true]:bg-primary data-[checked=true]:text-white transition'
                                data-checked={field.value === user.slug}
                              >
                                <user.icon size={22} />
                                {user.name}
                                <input
                                  type='radio'
                                  value={user.slug}
                                  checked={field.value === user.slug}
                                  onChange={(...args) => {
                                    field.onChange(...args)
                                  }}
                                  className='hidden'
                                />
                              </label>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col items-center text-center gap-2'>
              <Button type='submit' className='text-white w-full'>
                Criar conta
              </Button>
              <span className='text-xs text-text'>
                Já possui uma conta?{' '}
                <Link href='/'>
                  <span className='underline'>Entrar</span>
                </Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  )
}
