'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, ChevronDown, LogOut, Settings, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import nookies from 'nookies'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/contexts/user-context'
import { supabase } from '@/db/supabase/client'

export function Header() {
  const { user } = useUser()
  const pathname = usePathname()
  const router = useRouter()

  function generateBreadcrumbItems() {
    const paths = pathname.split('/').filter((path) => path !== '')

    function createPathsLinks(currentPathIndex: number) {
      return '/' + paths.slice(0, currentPathIndex + 1).join('/')
    }

    return paths.map((path, index) => {
      return index + 1 < paths.length ? (
        <>
          <BreadcrumbItem key={`link-${index}`}>
            <BreadcrumbLink asChild>
              <Link href={createPathsLinks(index)} className='capitalize'>
                {path}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </>
      ) : (
        <BreadcrumbItem key={`page-${index}`}>
          <BreadcrumbPage className='capitalize'>{path}</BreadcrumbPage>
        </BreadcrumbItem>
      )
    })
  }

  function handleSignOut() {
    nookies.destroy(null, '@portjobs.user.name')
    nookies.destroy(null, '@portjobs.user.type')
    nookies.destroy(null, '@portjobs.user.email')
    router.push('/')
    supabase.auth.signOut()
  }

  return (
    <header className='flex w-full justify-center bg-background p-4 h-16'>
      <div className='flex w-full gap-8 justify-between items-center'>
        <div className='flex justify-center gap-8'>
          <Breadcrumb>
            <BreadcrumbList>{generateBreadcrumbItems()}</BreadcrumbList>
          </Breadcrumb>

          <div className='flex space-x-2 items-center'></div>
        </div>

        <div className='flex space-x-2 items-center'>
          <Bell className='text-primary' />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* {isLoading ? (
                <Skeleton className='w-[200px] h-8 rounded-full bg-primary/20' />
              ) : (
                <button className='flex justify-center items-center gap-1 h-8 px-4 lowercase text-sm text-primary bg-primary/20 rounded-full'>
                  {user && user?.email}
                  <ChevronDown className='size-4' />
                </button>
              )} */}

              <button className='flex justify-center items-center gap-1 h-8 px-4 lowercase text-sm text-primary bg-primary/20 rounded-full'>
                {user?.email || 'PortJOBS'}
                <ChevronDown className='size-4' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='cursor-pointer'>
                <Settings />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>
                <UserRound />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>
                <Bell />
                Notificações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className='cursor-pointer'
              >
                <LogOut />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
