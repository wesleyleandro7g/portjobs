'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/db/supabase/client'

import type { JobType } from '@/types/jobs'

interface useJobsByCompanyProps {
  userId?: string
}

export function useJobsByCompany({ userId }: useJobsByCompanyProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobs', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user', userId)
      if (error) throw error
      return data as JobType[]
    },
  })

  const dataFormated = data?.map((job) => {
    const responsibilities = Object.keys(job.responsibilities).map(
      (key) => job.responsibilities[key]
    )

    const requirements = Object.keys(job.requirements).map(
      (key) => job.requirements[key]
    )

    const differentials = Object.keys(job.differentials).map(
      (key) => job.differentials[key]
    )

    const benefits = Object.keys(job.benefits).map((key) => job.benefits[key])

    const candidates = Object?.keys(job.candidates).map((key) => {
      return { id: job.candidates[key].id, name: job.candidates[key].name }
    })

    return {
      ...job,
      responsibilities,
      requirements,
      differentials,
      benefits,
      candidates,
    }
  })

  return { data: dataFormated, isLoading, isError }
}
