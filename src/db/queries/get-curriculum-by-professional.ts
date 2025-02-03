'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/db/supabase/client'

import type { CuriculumType } from '@/types/curriculum'

interface useJobsByCompanyProps {
  userId?: string
}

export function useCurriculumByProfessional({ userId }: useJobsByCompanyProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['curriculum', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('curriculum')
        .select('*')
        .eq('user', userId)
        .single()
      if (error) throw error
      return data as CuriculumType
    },
    enabled: !!userId,
  })

  const qualities = Object.keys(data?.qualities || {}).map(
    (key) => data?.qualities[key] as string
  )
  const experiences = Object.keys(data?.experiences || {}).map(
    (key) => data?.experiences[key] as string
  )
  const differentials = Object.keys(data?.differentials || {}).map(
    (key) => data?.differentials[key] as string
  )

  const dataFormated = {
    ...data,
    qualities,
    experiences,
    differentials,
  }

  return { data: dataFormated, isLoading, isError, refetch }
}
