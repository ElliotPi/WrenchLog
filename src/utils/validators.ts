import { z } from 'zod'

export const vehicleFormSchema = z.object({
  vin: z.string().trim().min(11, 'Enter at least 11 VIN characters.').max(17, 'VIN cannot exceed 17 characters.'),
  year: z.string().trim().min(1, 'Year is required.'),
  make: z.string().trim().min(1, 'Make is required.'),
  model: z.string().trim().min(1, 'Model is required.'),
  trim: z.string().trim().optional(),
  nickname: z.string().trim().min(1, 'Nickname is required.'),
  description: z.string().trim().max(280, 'Description should stay under 280 characters.').optional(),
})

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>

export const serviceRecordFormSchema = z.object({
  serviceType: z.string().trim().min(1, 'Service type is required.'),
  date: z.string().trim().min(1, 'Date is required.'),
  mileage: z
    .string()
    .trim()
    .min(1, 'Mileage is required.')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, 'Mileage cannot be negative.')
    .transform((value) => Number(value)),
  cost: z
    .string()
    .trim()
    .optional()
    .refine((value) => value === undefined || value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0), 'Cost cannot be negative.')
    .transform((value) => (value === undefined || value === '' ? undefined : Number(value))),
  notes: z.string().trim().max(500, 'Notes should stay under 500 characters.').optional(),
})

export type ServiceRecordFormValues = z.input<typeof serviceRecordFormSchema>
export type ServiceRecordFormData = z.output<typeof serviceRecordFormSchema>
