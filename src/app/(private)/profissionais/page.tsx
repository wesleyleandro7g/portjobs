'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Building2, ChevronDown, DollarSign, MapPin, Radio } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import { useCurriculum } from '@/db/queries/get-curriculum'
import { Spin } from '@/components/system/spin'

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

export default function Professionals() {
  const { data, isLoading } = useCurriculum()

  const [openCollapsible, setOpenCollapsible] = useState<number | null>(null)

  return (
    <div className='flex flex-1 flex-col gap-4'>
      {isLoading && (
        <div className='flex flex-col items-center justify-center w-full h-full gap-5'>
          <Spin />
          <h2 className='text-md font-normal text-text/40'>
            Carregando prodissionais...
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
            Nenhum candidato disponível no momento
          </h2>
        </div>
      )}

      {data?.map((professional) => {
        const isOpened = openCollapsible === professional.id

        return (
          <Collapsible
            key={professional.id}
            open={isOpened}
            onOpenChange={() =>
              setOpenCollapsible(isOpened ? null : professional.id)
            }
          >
            <div
              data-isOpened={isOpened}
              className='flex flex-col md:grid grid-cols-3 bg-white rounded-b-lg data-[isOpened=true]:rounded-b-none rounded-t-lg p-5 w-full'
            >
              <div className='flex flex-col col-span-2 text-left w-full gap-1'>
                <h2 className='text-xl font-semibold'>{professional.name}</h2>
                <p className='text-text font-light leading-5'>
                  {professional.description}
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
                  <div>
                    <h6 className='font-semibold'>Qualidades</h6>
                    <ul>
                      {professional?.qualities.map((quality) => (
                        <li
                          key={quality}
                          className='text-text font-light text-sm leading-6'
                        >
                          ✅ {quality}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className='font-semibold'>Experiências</h6>
                    <ul>
                      {professional?.experiences.map((experience) => (
                        <li
                          key={experience}
                          className='text-text font-light text-sm leading-6'
                        >
                          🎯 {experience}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className='font-semibold'>Diferenciais</h6>
                    <ul>
                      {professional?.differentials.map((differential) => (
                        <li
                          key={differential}
                          className='text-text font-light text-sm leading-6'
                        >
                          🚀 {differential}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className='col-span-1 space-y-4 flex flex-col gap-2 justify-between h-full'>
                  <div className='flex flex-col gap-2 h-fit'>
                    <h6 className='font-semibold'>Detalhes</h6>
                    <div className='flex flex-wrap gap-4'>
                      <Details
                        Icon={DollarSign}
                        title='Salário'
                        value={`R$${professional.salary}`}
                      />
                      <Details
                        Icon={MapPin}
                        title='Localização'
                        value={professional.location}
                      />
                      <Details
                        Icon={Building2}
                        title='Contrato'
                        value={professional.contract}
                      />
                      <Details
                        Icon={Radio}
                        title='Remoto'
                        value={professional.type}
                      />
                    </div>
                  </div>

                  <div className='flex flex-col w-full gap-2'>
                    <Link
                      className='w-full'
                      href={`https://wa.me/55${professional.phone}?text=Ol%C3%A1%2C%20vi%20voc%C3%AA%20se%20interessou%20por%20uma%20de%20nossas%20vagas.%20Vamos%20agendar%20uma%20entrevista%3F`}
                    >
                      <Button type='submit' className='text-white w-full'>
                        Entrar em contato
                      </Button>
                    </Link>
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
