import { Building, UserRound } from 'lucide-react'
import { z } from 'zod'

export const userTypes = [
  {
    id: 1,
    name: 'Profissional',
    slug: 'profissional',
    icon: UserRound,
  },
  {
    id: 2,
    name: 'Empresa',
    slug: 'empresa',
    icon: Building,
  },
]

export const formSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Insira um email válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  type: z.string().min(1, 'Selecione um tipo'),
})
