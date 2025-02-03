'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { CircleCheckBig, Plus, Trash } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

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

import { supabase } from '@/db/supabase/client'
import { useToast } from '@/hooks/use-toast'

import { formSchema } from './form-schema'
import { Spinner } from '@/components/system/spinner'
import { useUser } from '@/contexts/user-context'
import { useQueryClient } from '@tanstack/react-query'
import { JobType } from '@/types/jobs'

export default function Editar() {
  const router = useRouter()
  const { user } = useUser()
  const { job_id } = useParams()
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const [responsibilities, setResposabilities] = useState<string[]>([])
  const [requirements, setRequirements] = useState<string[]>([])
  const [differentials, setDifferentials] = useState<string[]>([])
  const [benefits, setBenefits] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      salary: '',
      location: '',
      contract: '',
      type: '',
      responsibilities: [],
      requirements: [],
      differentials: [],
      benefits: [],
    },
    disabled: loading,
  })

  const { toast } = useToast()

  useEffect(() => {
    const cachedJobs: JobType[] | undefined = queryClient.getQueryData([
      'jobs',
      user?.id,
    ])

    if (!cachedJobs) {
      router.push('/painel')
    }

    if (cachedJobs) {
      const jobToEdit = cachedJobs?.find(
        (job: JobType) => job.id === Number(job_id)
      )

      const responsibilities = Object.keys(
        jobToEdit?.responsibilities || {}
      ).map((key) => jobToEdit?.responsibilities[key] || '')

      const requirements = Object.keys(jobToEdit?.requirements || {}).map(
        (key) => jobToEdit?.requirements[key] || ''
      )

      const differentials = Object.keys(jobToEdit?.differentials || {}).map(
        (key) => jobToEdit?.differentials[key] || ''
      )

      const benefits = Object.keys(jobToEdit?.benefits || {}).map(
        (key) => jobToEdit?.benefits[key] || ''
      )

      form.reset({
        title: jobToEdit?.title,
        description: jobToEdit?.description,
        salary: jobToEdit?.salary,
        location: jobToEdit?.location,
        contract: jobToEdit?.contract,
        type: jobToEdit?.type,
        responsibilities,
        requirements,
        differentials,
        benefits,
      })

      setResposabilities(responsibilities)
      setRequirements(requirements)
      setDifferentials(differentials)
      setBenefits(benefits)
    }
  }, [user?.id, job_id])

  const addResponsability = () => {
    setResposabilities([...responsibilities, ''])
  }

  const addRequirement = () => {
    setRequirements([...requirements, ''])
  }

  const addDifferential = () => {
    setDifferentials([...differentials, ''])
  }

  const addBenefit = () => {
    setBenefits([...benefits, ''])
  }

  const removeResponsability = (index: number) => {
    setResposabilities(responsibilities.filter((_, i) => i !== index))
    form.setValue(
      'responsibilities',
      form
        .getValues('responsibilities')
        ?.filter((_: string, i: number) => i !== index)
    )
  }

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
    form.setValue(
      'requirements',
      form
        .getValues('requirements')
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

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index))
    form.setValue(
      'benefits',
      form.getValues('benefits')?.filter((_: string, i: number) => i !== index)
    )
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    const {
      responsibilities = [],
      requirements = [],
      differentials = [],
      benefits = [],
      ...rest
    } = values

    const responsabilitiesJSON = Object.fromEntries(
      Object.entries(responsibilities).map(([key, value]) => [key, value])
    )

    const requirementsJSON = Object.fromEntries(
      Object.entries(requirements).map(([key, value]) => [key, value])
    )

    const differentialsJSON = Object.fromEntries(
      Object.entries(differentials).map(([key, value]) => [key, value])
    )

    const benefitsJSON = Object.fromEntries(
      Object.entries(benefits).map(([key, value]) => [key, value])
    )

    const { error } = await supabase
      .from('jobs')
      .update({
        id: Number(job_id),
        title: rest.title,
        description: rest.description,
        salary: rest.salary,
        location: rest.location,
        contract: rest.contract,
        type: rest.type,
        responsibilities: responsabilitiesJSON,
        requirements: requirementsJSON,
        differentials: differentialsJSON,
        benefits: benefitsJSON,
      })
      .eq('id', Number(job_id))

    setLoading(false)

    if (error) {
      return toast({
        title: 'Oops! Erro ao atualizar vaga',
        description: error.message,
      })
    }

    toast({
      title: 'Vaga atualizada com sucesso',
      description: 'Sua vaga foi atualizada com sucesso!',
    })

    router.push('/painel')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='flex flex-1 flex-col gap-4'>
          <div className='flex justify-between items-center w-full'>
            <h1 className='text-2xl font-semibold'>Editar vaga</h1>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 w-full items-center gap-4 bg-white p-4 rounded-md'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da vaga</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Gerente de vendas regional...'
                      {...field}
                    />
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
                      placeholder='Buscamos por um gerente de vendas regional com vasta experiência...'
                      {...field}
                    />
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
                  <FormLabel>Salário</FormLabel>
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

          {/* RESPONSABILIDADES */}
          <div className='space-y-2 bg-white p-4 rounded-md'>
            <h2 className='text-lg font-semibold'>Responsabilidades</h2>
            <div className='grid grid-cols-1 gap-4'>
              {responsibilities.map((_, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <FormField
                    control={form.control}
                    name={`responsibilities.${index}`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <Input
                            placeholder='Gerenciar equipe de vendas...'
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
            {form.formState.errors.requirements && (
              <p className='text-red-500'>
                {form.formState.errors.requirements.message}
              </p>
            )}
          </div>

          {/* REQUISITOS */}
          <div className='space-y-2 bg-white p-4 rounded-md'>
            <h2 className='text-lg font-semibold'>Requisitos</h2>
            <div className='grid grid-cols-1 gap-4'>
              {requirements.map((_, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <FormField
                    control={form.control}
                    name={`requirements.${index}`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <Input
                            placeholder='Experiência comprovada em gestão de times de vendas...'
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
            {form.formState.errors.requirements && (
              <p className='text-red-500'>
                {form.formState.errors.requirements.message}
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
                            placeholder='Fluete em Inglês ou Espanhol'
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

          {/* BENEFÍCIOS */}
          <div className='space-y-2 bg-white p-4 rounded-md'>
            <h2 className='text-lg font-semibold'>Benefícios</h2>
            <div className='grid grid-cols-1 gap-4'>
              {benefits.map((_, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <FormField
                    control={form.control}
                    name={`benefits.${index}`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <Input placeholder='Vale alimentação' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      variant='destructive'
                      onClick={() => removeBenefit(index)}
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
                  onClick={addBenefit}
                >
                  <Plus />
                </Button>
              </div>
            </div>
            {form.formState.errors.benefits && (
              <p className='text-red-500'>
                {form.formState.errors.benefits.message}
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
