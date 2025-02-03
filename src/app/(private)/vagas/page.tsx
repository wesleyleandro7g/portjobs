'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Building2, ChevronDown, DollarSign, MapPin, Radio } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useToast } from '@/hooks/use-toast'

import Image from 'next/image'
import { Spin } from '@/components/system/spin'
import { useJobs } from '@/db/queries/get-jobs'
import { supabase } from '@/db/supabase/client'
import { useUser } from '@/contexts/user-context'

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

export default function Vagas() {
  const { user } = useUser()
  const { toast } = useToast()

  const [openCollapsible, setOpenCollapsible] = useState<number | null>(null)

  const { data, isLoading, refetch } = useJobs()

  async function handleApplyJob(jobId: number) {
    const oldCandidates = data?.find((job) => job.id === jobId)?.candidates
    const newCadidatesList = [
      ...(oldCandidates || []),
      { id: user?.id, name: user?.name },
    ]

    const cadidatesJSON = Object.fromEntries(
      Object.entries(newCadidatesList).map(([key, value]) => [key, value])
    )

    if (oldCandidates) {
      const isAlreadyApplied = oldCandidates.find(
        (candidate) => candidate.id === user?.id
      )
      if (isAlreadyApplied) {
        return toast({
          title: 'Você já se candidatou a essa vaga',
          description: 'Não é possível se candidatar mais de uma vez',
        })
      }
    }

    const { error } = await supabase
      .from('jobs')
      .update({
        candidates: cadidatesJSON,
      })
      .eq('id', jobId)

    if (error) {
      return toast({
        title: 'Erro ao se candidatar',
        description: 'Tente novamente mais tarde',
      })
    }

    toast({
      title: 'Candidatura realizada com sucesso',
      description: 'Boa sorte!',
    })

    refetch()
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      {isLoading && (
        <div className='flex flex-col items-center justify-center w-full h-full gap-5'>
          <Spin />
          <h2 className='text-md font-normal text-text/40'>
            Carregando vagas...
          </h2>
        </div>
      )}
      {data?.length === 0 && !isLoading && (
        <div className='flex flex-col items-center justify-center w-full h-full gap-5'>
          <Image
            src='/undraw_informed-decision_2jwi.svg'
            alt=''
            width={400}
            height={300}
          />
          <h2 className='text-xl text-text font-semibold'>
            Não há nenhuma vaga em aberto
          </h2>
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
              className='flex flex-col md:grid grid-cols-3 bg-white rounded-b-lg data-[isOpened=true]:rounded-b-none rounded-t-lg p-5 w-full gap-3'
            >
              <div className='flex flex-col col-span-2 text-left w-full gap-1'>
                <h2 className='text-xl font-semibold'>{job.title}</h2>
                <p className='text-text font-light leading-5'>
                  {job.description}
                </p>
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
              </div>
            </div>
            <CollapsibleContent>
              <div className='flex flex-col md:grid grid-cols-3 bg-white rounded-b-lg rounded-t-none p-5 pt-0'>
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

                  <div className='flex flex-col w-full gap-2'>
                    <Button
                      onClick={() => handleApplyJob(job.id)}
                      className='text-white'
                    >
                      Se candidatar à essa vaga
                    </Button>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </div>
  )
}
