export type JobType = {
  id: number
  created_at: string
  title: string
  description: string
  salary: string
  location: string
  contract: string
  type: string
  status: string
  responsibilities: Record<string, string>
  requirements: Record<string, string>
  differentials: Record<string, string>
  benefits: Record<string, string>
  candidates: Record<{ id: string; name: string }>
  user: string
}
