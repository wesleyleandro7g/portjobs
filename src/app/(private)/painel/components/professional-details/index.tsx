'use client'

import Link from 'next/link'
import { Spin } from '@/components/system/spin'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCurriculumByProfessional } from '@/db/queries/get-curriculum-by-professional'

interface ProfessionalDetailsProps {
  professionalId: string
}

export function ProfessionalDetails({
  professionalId,
}: ProfessionalDetailsProps) {
  const { data, isLoading, isError } = useCurriculumByProfessional({
    userId: professionalId,
  })

  if (isLoading || isError) {
    return (
      <DialogContent>
        <div className='flex items-center justify-center h-64'>
          <Spin />
        </div>
      </DialogContent>
    )
  }

  return (
    <DialogContent className='max-w-3xl w-[90%] md:w-full rounded-md'>
      <DialogHeader>
        <DialogTitle className='text-left'>{data.name}</DialogTitle>
        <DialogDescription className='text-left'>
          {data.description}
        </DialogDescription>
        <span className='text-text text-sm text-left'>
          Telefone.: {data.phone}
        </span>
      </DialogHeader>
      <div className='space-y-4'>
        <div className='col-span-2 space-y-4'>
          <div>
            <h6 className='font-semibold'>Qualidades</h6>
            <ul>
              {data?.qualities.map((quality) => (
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
              {data?.experiences.map((experience) => (
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
              {data?.differentials.map((differential) => (
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
      </div>
      <DialogFooter>
        <Link
          href={`https://wa.me/55${data.phone}?text=Ol%C3%A1%2C%20vi%20voc%C3%AA%20se%20interessou%20por%20uma%20de%20nossas%20vagas.%20Vamos%20agendar%20uma%20entrevista%3F`}
        >
          <Button type='submit' className='text-white'>
            Entrar em contato
          </Button>
        </Link>
      </DialogFooter>
    </DialogContent>
  )
}

export { Dialog, DialogTrigger }
