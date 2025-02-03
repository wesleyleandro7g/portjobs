'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { CircleCheckBig, Plus, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Spin } from '@/components/system/spin'
import { Spinner } from '@/components/system/spinner'

import { supabase } from '@/db/supabase/client'
import { useToast } from '@/hooks/use-toast'

import { formSchema } from './form-schema'
import { useUser } from '@/contexts/user-context'
import { useCurriculumByProfessional } from '@/db/queries/get-curriculum-by-professional'

export default function Curriculo() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  const { data, isLoading, refetch } = useCurriculumByProfessional({
    userId: user?.id,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      salary: '',
      location: '',
      contract: '',
      type: '',
      phone: '',
      qualities: [],
      experiences: [],
      differentials: [],
    },
    disabled: loading,
    reValidateMode: 'onBlur',
  })

  const { toast } = useToast()

  const [qualities, setQualities] = useState<string[]>([])
  const [experiences, setExperiences] = useState<string[]>([])
  const [differentials, setDifferentials] = useState<string[]>([])

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        description: data.description,
        salary: data.salary,
        location: data.location,
        contract: data.contract,
        type: data.type,
        phone: data.phone,
        qualities: data.qualities,
        experiences: data.experiences,
        differentials: data.differentials,
      })
      setQualities(data.qualities || [])
      setExperiences(data.experiences || [])
      setDifferentials(data.differentials || [])
    }
  }, [isLoading])

  const addResponsability = () => {
    setQualities([...qualities, ''])
  }

  const addRequirement = () => {
    setExperiences([...experiences, ''])
  }

  const addDifferential = () => {
    setDifferentials([...differentials, ''])
  }

  const removeResponsability = (index: number) => {
    setQualities(qualities.filter((_, i) => i !== index))
    form.setValue(
      'qualities',
      form.getValues('qualities')?.filter((_: string, i: number) => i !== index)
    )
  }

  const removeRequirement = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index))
    form.setValue(
      'experiences',
      form
        .getValues('experiences')
        ?.filter((_: string, i: number) => i !== index)
    )
  }

  const removeDiferencial = (index: number) => {
    setDifferentials(differentials.filter((_, i) => i !== index))
    form.setValue(
      'differentials',
      form
        .getValues('differentials')
        ?.filter((_: string, i: number) => i !== index)
    )
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    const {
      qualities = [],
      experiences = [],
      differentials = [],
      ...rest
    } = values

    const responsabilitiesJSON = Object.fromEntries(
      Object.entries(qualities).map(([key, value]) => [key, value])
    )

    const experiencesJSON = Object.fromEntries(
      Object.entries(experiences).map(([key, value]) => [key, value])
    )

    const differentialsJSON = Object.fromEntries(
      Object.entries(differentials).map(([key, value]) => [key, value])
    )

    const { error } = await supabase.from('curriculum').upsert({
      id: data.id,
      name: rest.name,
      description: rest.description,
      salary: rest.salary,
      location: rest.location,
      contract: rest.contract,
      type: rest.type,
      phone: rest.phone,
      qualities: responsabilitiesJSON,
      experiences: experiencesJSON,
      differentials: differentialsJSON,
      status: 'visivel',
      user: user?.id,
    })

    setLoading(false)

    if (error) {
      return toast({
        title: 'Oops! Erro ao atualizar currículo',
        description: error.message,
      })
    }

    toast({
      title: 'Currículo atualizado com sucesso',
      description: 'Seu currículo foi atualizado com sucesso!',
    })

    refetch()
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full h-full'>
        <Spin />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex justify-between items-center w-full'>
            <h1 className='text-2xl font-semibold'>Meu currículo</h1>
          </div>
          <div className='grid grid-cols-3 w-full items-center gap-4 bg-white p-4 rounded-md'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu nome</FormLabel>
                  <FormControl>
                    <Input placeholder='Digite seu nome completo' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Sou um desenvolvedor fullstack com 5 anos de experiência...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone/Whatsapp</FormLabel>
                  <FormControl>
                    <Input placeholder='(38) 9 9999-9999' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='salary'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exepctativa salarial</FormLabel>
                  <FormControl>
                    <Input placeholder='5000' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Input placeholder='Porteirinha, Centro' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='contract'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de contrato</FormLabel>
                  <FormControl>
                    <Input placeholder='CLT/PJ' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo da vaga</FormLabel>
                  <FormControl>
                    <Input placeholder='Remota/Presencial' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* QUALIDADES */}
          <div className='space-y-2 bg-white p-4 rounded-md'>
            <h2 className='text-lg font-semibold'>Qualidades</h2>
            <div className='grid grid-cols-1 gap-4'>
              {qualities.map((_, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <FormField
                    control={form.control}
                    name={`qualities.${index}`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <Input
                            placeholder='Digita a sua qualidade'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      variant='destructive'
                      onClick={() => removeResponsability(index)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}
              <div className='flex justify-end'>
                <Button
                  type='button'
                  className='text-white'
                  onClick={addResponsability}
                >
                  <Plus />
                </Button>
              </div>
            </div>
            {form.formState.errors.experiences && (
              <p className='text-red-500'>
                {form.formState.errors.experiences.message}
              </p>
            )}
          </div>

          {/* EXPERIÊNCIA */}
          <div className='space-y-2 bg-white p-4 rounded-md'>
            <h2 className='text-lg font-semibold'>Experiências</h2>
            <div className='grid grid-cols-1 gap-4'>
              {experiences.map((_, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <FormField
                    control={form.control}
                    name={`experiences.${index}`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <Input
                            placeholder='Título do cargo [Empresa] [Tempo]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      variant='destructive'
                      onClick={() => removeRequirement(index)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}
              <div className='flex justify-end'>
                <Button
                  type='button'
                  className='text-white'
                  onClick={addRequirement}
                >
                  <Plus />
                </Button>
              </div>
            </div>
            {form.formState.errors.experiences && (
              <p className='text-red-500'>
                {form.formState.errors.experiences.message}
              </p>
            )}
          </div>

          {/* DIFERENCIAIS */}
          <div className='space-y-2 bg-white p-4 rounded-md'>
            <h2 className='text-lg font-semibold'>Diferenciais</h2>
            <div className='grid grid-cols-1 gap-4'>
              {differentials.map((_, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <FormField
                    control={form.control}
                    name={`differentials.${index}`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <Input
                            placeholder='Fluete em Inglês e Espanhol'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      variant='destructive'
                      onClick={() => removeDiferencial(index)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}
              <div className='flex justify-end'>
                <Button
                  type='button'
                  className='text-white'
                  onClick={addDifferential}
                >
                  <Plus />
                </Button>
              </div>
            </div>
            {form.formState.errors.differentials && (
              <p className='text-red-500'>
                {form.formState.errors.differentials.message}
              </p>
            )}
          </div>

          <div className='flex justify-end w-full mb-4'>
            <Button type='submit' className='text-white' disabled={loading}>
              {loading ? (
                <div className='flex items-center gap-2'>
                  Salvando...
                  <Spinner />
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  Salvar
                  <CircleCheckBig />
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
