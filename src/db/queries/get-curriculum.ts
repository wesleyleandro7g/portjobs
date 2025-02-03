'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/db/supabase/client'

import type { CuriculumType } from '@/types/curriculum'

export function useCurriculum() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['all-curriculum'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('curriculum')
        .select('*')
        .eq('status', 'visivel')
      if (error) throw error
      return data as CuriculumType[]
    },
  })

  const dataFormated = data?.map((curriculum) => {
    const qualities = Object.keys(curriculum?.qualities || {}).map(
      (key) => curriculum?.qualities[key] as string
    )
    const experiences = Object.keys(curriculum?.experiences || {}).map(
      (key) => curriculum?.experiences[key] as string
    )
    const differentials = Object.keys(curriculum?.differentials || {}).map(
      (key) => curriculum?.differentials[key] as string
    )

    return {
      ...curriculum,
      qualities,
      experiences,
      differentials,
    }
  })

  return { data: dataFormated, isLoading, isError, refetch }
}
