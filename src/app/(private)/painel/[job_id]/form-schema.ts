import { z } from 'zod'

export const formSchema = z.object({
  title: z.string().min(5, 'Insira um título com no mínimo 5 caracteres'),
  description: z
    .string()
    .min(10, 'Insira uma descrição com no mínimo 10 caracteres'),
  salary: z.string().min(3, 'Insira um salário válido'),
  location: z
    .string()
    .min(5, 'Insira uma localização com no mínimo 5 caracteres'),
  contract: z
    .string()
    .min(2, 'Insira o tipo de contrato com no mínimo 5 caracteres'),
  type: z.string().min(5, 'Insira um tipo com no mínimo 5 caracteres'),
  responsibilities: z
    .array(z.string().min(5, 'Insira a responsabilidade'))
    .optional(),
  requirements: z.array(z.string().min(5, 'Insira o requisito')).optional(),
  differentials: z.array(z.string().min(5, 'Insira o diferencial')).optional(),
  benefits: z.array(z.string().min(5, 'Insira o benefício')).optional(),
})
