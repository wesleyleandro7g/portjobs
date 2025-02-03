export type CuriculumType = {
  id: number
  created_at: string
  name: string
  description: string
  salary: string
  location: string
  contract: string
  type: string
  status: string
  phone: string
  qualities: Record<string, string>
  experiences: Record<string, string>
  differentials: Record<string, string>
  user: string
}
