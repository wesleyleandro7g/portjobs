'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Building2,
  ChevronDown,
  DollarSign,
  Edit2,
  Eye,
  MapPin,
  Plus,
  Radio,
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogTrigger,
  ProfessionalDetails,
} from './components/professional-details'

import { useUser } from '@/contexts/user-context'
import { useJobsByCompany } from '@/db/queries/get-jobs-by-company'
import { Spin } from '@/components/system/spin'
import { supabase } from '@/db/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface DetailsProps {
  Icon: any
  title: string
  value: string | number
}

function Details({ Icon, title, value }: DetailsProps) {
  return (
    <div className='flex flex-col p-2 items-start h-fit bg-background/60 rounded-md gap-2'>
      <Icon className='text-primary size-7' />
      <div className='flex flex-col ml-1'>
        <span className='text-text font-light'>{title}:</span>
        <span className='text-text font-semibold leading-3'>{value}</span>
      </div>
    </div>
  )
}

export default function Panel() {
  const { user } = useUser()
  const { toast } = useToast()

  const [openCollapsible, setOpenCollapsible] = useState<number | null>(null)
  const [professionalId, setProfessionalId] = useState<string>('')
  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false)

  const { data, isLoading, refetch } = useJobsByCompany({ userId: user?.id })

  async function changeJobStatus(jobId: number, status: string) {
    setIsLoadingUpdate(true)

    const { error } = await supabase
      .from('jobs')
      .update({
        status,
      })
      .eq('id', jobId)

    setIsLoadingUpdate(false)

    if (error) {
      return toast({
        title: 'Oops! Erro ao atualizar status da vaga',
        description: error.message,
      })
    }

    toast({
      title: 'Status da vaga atualizado com sucesso',
      description: 'Sua vaga foi atualizada com sucesso!',
    })

    refetch()
  }

  return (
    <Dialog>
      <div className='flex flex-1 flex-col gap-4'>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-2xl font-semibold'>Vagas</h1>
          <Link href='/painel/cadastrar'>
            <Button className='text-white'>
              <Plus /> Adicionar vaga
            </Button>
          </Link>
        </div>
        {isLoading && (
          <div className='flex flex-col items-center justify-center w-full h-full gap-5'>
            <Spin />
            <h2 className='text-md font-normal text-text/40'>
              Carregando suas vagas...
            </h2>
          </div>
        )}
        {data?.length === 0 && !isLoading && (
          <div className='flex flex-col items-center justify-center w-full h-full gap-5'>
            <Image
              src='/undraw_no-data_ig65.svg'
              alt=''
              width={400}
              height={300}
            />
            <h2 className='text-xl text-text font-semibold'>
              Você ainda não cadastrou nenhuma vaga
            </h2>
            <Link href='/painel/cadastrar'>
              <Button className='text-white'>
                <Plus /> Adicionar minha primeira vaga
              </Button>
            </Link>
          </div>
        )}
        {data?.map((job) => {
          const isOpened = openCollapsible === job.id

          return (
            <Collapsible
              key={job.id}
              open={isOpened}
              onOpenChange={() => setOpenCollapsible(isOpened ? null : job.id)}
            >
              <div
                data-isOpened={isOpened}
                className='grid grid-cols-3 bg-white rounded-b-lg data-[isOpened=true]:rounded-b-none rounded-t-lg p-5 w-full'
              >
                <div className='flex flex-col col-span-2 text-left w-full gap-1'>
                  <h2 className='text-xl font-semibold'>{job.title}</h2>
                  <p className='text-text font-light leading-5'>
                    {job.description}
                  </p>
                  <div
                    data-active={job.status === 'aberta'}
                    className='px-3 py-1 bg-red-300 text-red-700 data-[active=true]:bg-green-300 data-[active=true]:text-green-800 rounded-full text-sm w-fit'
                  >
                    <span>{job.status}</span>
                  </div>
                </div>
                <div className='flex w-full justify-end items-start gap-4'>
                  <CollapsibleTrigger>
                    <div className='flex items-center gap-1 cursor-pointer bg-primary/20 p-2 rounded-md text-sm text-primary'>
                      <ChevronDown
                        data-isOpened={isOpened}
                        className='text-primary size-5'
                        style={{
                          transition: 'transform 0.3s ease-in-out',
                          transform: `rotate(${isOpened ? 180 : 0}deg)`,
                        }}
                      />
                      {isOpened ? 'Ver menos' : 'Detalhes'}
                    </div>
                  </CollapsibleTrigger>
                  <Link href={`/painel/${job.id}`}>
                    <Button className='text-white'>
                      <Edit2 /> Editar
                    </Button>
                  </Link>
                </div>
              </div>
              <CollapsibleContent>
                <div className='grid grid-cols-3 bg-white rounded-b-lg rounded-t-none p-5 pt-0'>
                  <div className='col-span-2 space-y-4'>
                    {job.responsibilities.length > 0 && (
                      <div>
                        <h6 className='font-semibold'>Responsabilidades</h6>
                        <ul>
                          {job.responsibilities.map((responsability) => (
                            <li
                              key={responsability}
                              className='text-text font-light text-sm leading-6'
                            >
                              ✅ {responsability}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {job.requirements.length > 0 && (
                      <div>
                        <h6 className='font-semibold'>Requisitos</h6>
                        <ul>
                          {job.requirements.map((requirement) => (
                            <li
                              key={requirement}
                              className='text-text font-light text-sm leading-6'
                            >
                              🎯 {requirement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {job.differentials.length > 0 && (
                      <div>
                        <h6 className='font-semibold'>Diferenciais</h6>
                        <ul>
                          {job.differentials.map((differential) => (
                            <li
                              key={differential}
                              className='text-text font-light text-sm leading-6'
                            >
                              🚀 {differential}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {job.benefits.length > 0 && (
                      <div>
                        <h6 className='font-semibold'>Benefícios</h6>
                        <ul>
                          {job.benefits.map((benefit) => (
                            <li
                              key={benefit}
                              className='text-text font-light text-sm leading-6'
                            >
                              ⭐ {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className='col-span-1 space-y-4 flex flex-col gap-2 justify-between h-full'>
                    <div className='flex flex-col gap-2 h-fit'>
                      <h6 className='font-semibold'>Detalhes</h6>
                      <div className='flex flex-wrap gap-4'>
                        <Details
                          Icon={DollarSign}
                          title='Salário'
                          value={`R$${job.salary}`}
                        />
                        <Details
                          Icon={MapPin}
                          title='Localização'
                          value={job.location}
                        />
                        <Details
                          Icon={Building2}
                          title='Contrato'
                          value={job.contract}
                        />
                        <Details Icon={Radio} title='Tipo' value={job.type} />
                      </div>
                    </div>

                    <div>
                      <h6 className='font-semibold'>Candidatos</h6>
                      {job.candidates.length === 0 ? (
                        <div>
                          <span>Nenhum candidato</span>
                        </div>
                      ) : (
                        <div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead className='text-right'></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {job?.candidates?.map((candidate) => (
                                <TableRow key={candidate.id}>
                                  <TableCell className='font-medium'>
                                    {candidate.name}
                                  </TableCell>
                                  <TableCell className='flex justify-end items-center'>
                                    <DialogTrigger
                                      className='bg-primary/20 p-2 hover:bg-primary/40 rounded-md'
                                      onClick={() =>
                                        setProfessionalId(candidate.id)
                                      }
                                    >
                                      <Eye className='text-primary' size={20} />
                                    </DialogTrigger>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                    <div className='flex flex-col w-full gap-2'>
                      <Button
                        className='text-white'
                        disabled={isLoadingUpdate}
                        onClick={() =>
                          changeJobStatus(
                            job.id,
                            job.status === 'aberta' ? 'encerrada' : 'aberta'
                          )
                        }
                      >
                        {job.status === 'aberta'
                          ? 'Encerrar vaga'
                          : 'Reabrir vaga'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}

        <ProfessionalDetails professionalId={professionalId} />
      </div>
    </Dialog>
  )
}
