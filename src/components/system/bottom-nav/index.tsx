/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { PieChart, Factory, UsersRound, UserRoundPen } from 'lucide-react'

import { useUser } from '@/contexts/user-context'

type AsideItemProps = {
  isActive?: boolean
  label: string
  href?: string
  Icon: any
}

function AsideItem({ href, label, isActive, Icon }: AsideItemProps) {
  return (
    <Link href={href || ''} className='w-full'>
      <div
        className='flex w-full flex-col py-2 gap-2 items-center text-gray-600 border-white rounded-none data-[active=true]:font-semibold data-[active=true]:bg-primary/20 data-[active=true]:border-b-0 data-[active=true]:border-primary data-[active=true]:text-primary hover:bg-background duration-200'
        data-active={isActive}
      >
        <Icon className='size-5' />
        <span className='text-sm'>{label}</span>
      </div>
    </Link>
  )
}

export function BottomNav() {
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
    <div className='absolute bottom-0 w-full p-0 flex items-center justify-evenly md:hidden bg-white border-t border-primary/20'>
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
  )
}
