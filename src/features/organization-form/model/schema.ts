import { z } from 'zod';

const phoneSchema = z.object({
    value: z.string(),
});

export const organizationSchema = z.object({
    name: z
        .string()
        .min(1, 'Название обязательно')
        .min(2, 'Минимум 2 символа')
        .max(200, 'Максимум 200 символов'),
    phones: z
        .array(phoneSchema)
        .min(1, 'Укажите хотя бы один телефон')
        .refine(
            (arr) => arr.some((p) => p.value.trim().length > 0),
            { message: 'Укажите хотя бы один телефон' },
        ),
    building_id: z
        .number({
            required_error: 'Выберите здание',
            invalid_type_error: 'Выберите здание',
        })
        .positive('Выберите здание'),
    activities: z
        .array(z.number())
        .min(1, 'Выберите хотя бы один вид деятельности'),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;