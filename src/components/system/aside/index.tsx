/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  PieChart,
  Factory,
  UsersRound,
  MoveRight,
  UserRoundPen,
} from 'lucide-react'

import { useUser } from '@/contexts/user-context'

type AsideItemProps = {
  isActive?: boolean
  label: string
  href?: string
  Icon: any
}

function AsideItem({ href, label, isActive, Icon }: AsideItemProps) {
  return (
    <Link href={href || ''}>
      <div
        className='flex py-2 px-4 gap-2 items-center text-gray-600 border-white rounded-full data-[active=true]:font-semibold data-[active=true]:bg-primary/20 data-[active=true]:border-b-0 data-[active=true]:border-primary data-[active=true]:text-primary hover:bg-background duration-200'
        data-active={isActive}
      >
        <Icon className='size-5' />
        <span className='text-sm'>{label}</span>
      </div>
    </Link>
  )
}

export function Aside() {
  const { user } = useUser()

  const pathName = usePathname()

  const asideItems = [
    {
      id: 0,
      label: 'Minhas Vagas',
      href: '/painel',
      icon: PieChart,
      type: 'empresa',
    },
    {
      id: 1,
      label: 'Profissionais',
      href: '/profissionais',
      icon: UsersRound,
      type: 'empresa',
    },
    {
      id: 2,
      label: 'Vagas',
      href: '/vagas',
      icon: Factory,
      type: 'profissional',
    },
    {
      id: 3,
      label: 'Meu currículo',
      href: '/curriculo',
      icon: UserRoundPen,
      type: 'profissional',
    },
  ]

  const filteredItems = asideItems.filter((item) => item.type === user?.type)

  return (
    <aside className='w-64 border-r-2 border-gray-200 p-4 space-y-7 relative hidden md:flex flex-col justify-between'>
      <div className='space-y-7'>
        <div className='flex items-center gap-2'>
          <h2 className='font-bold'>PortJOBS</h2>
          <span className='text-xs font-light'>{user?.type}</span>
        </div>
        <div className='flex flex-col space-y-2.5'>
          {filteredItems.map((item) => {
            return (
              <AsideItem
                key={item.id}
                href={item.href}
                label={item.label}
                Icon={item.icon}
                isActive={pathName.startsWith(item.href)}
              />
            )
          })}
        </div>
      </div>
      <div className='flex flex-col items-start text-start gap-2 bg-primary/10 p-4 rounded-xl'>
        <h6 className='text-sm font-semibold text-text'>Alerta de vagas!</h6>
        <span className='text-xs text-gray-600 text-start'>
          Ative o alerta de vagas e receba oportunidades incríveis em primeira
          mão!
        </span>
        <button className='flex items-center gap-2 text-primary font-semibold text-xs'>
          Saiba mais <MoveRight />
        </button>
      </div>
    </aside>
  )
}
