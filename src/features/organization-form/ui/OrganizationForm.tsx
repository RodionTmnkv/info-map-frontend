'use client';

import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  organizationSchema,
  type OrganizationFormValues,
} from '../model/schema';
import type {
  OrganizationDetail,
  OrganizationFormPayload,
} from '@/entities/organization';
import {
  useCreateOrganization,
  useUpdateOrganization,
} from '@/entities/organization';
import { ActivityTreeSelect } from '@/features/activity-select';
import { BuildingSelect } from '@/features/organization-filter';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

interface Props {
  organization?: OrganizationDetail;
  organizationId?: number;
}

export function OrganizationForm({ organization, organizationId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(organizationId);

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      phones: [{ value: '' }],
      building_id: undefined as unknown as number,
      activities: [],
    },
  });

  useEffect(() => {
    if (!organization) return;
    form.reset({
      name: organization.name,
      phones:
          organization.phones.length > 0
              ? organization.phones.map((p) => ({ value: p.phone_number }))
              : [{ value: '' }],
      building_id: organization.building.id,
      activities: organization.activities.map((a) => a.id),
    });
  }, [organization, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'phones',
  });

  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization(organizationId ?? 0);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (values: OrganizationFormValues) => {
    const cleanPhones = values.phones
        .map((p) => p.value.trim())
        .filter((p) => p.length > 0);

    const payload: OrganizationFormPayload = {
      name: values.name,
      phones: cleanPhones.map((p) => ({ phone_number: p })),
      building_id: values.building_id,
      activities: values.activities,
    };

    try {
      if (isEdit && organizationId) {
        await updateMutation.mutateAsync(payload);
        toast.success('Организация обновлена');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Организация создана');
      }
      router.push('/');
      router.refresh();
    } catch (e) {
      const msg =
          e instanceof Error
              ? e.message
              : 'Не удалось сохранить. Эндпоинт может отсутствовать на бэкенде.';
      toast.error(msg);
    }
  };

  return (
      <Form {...form}>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
        >
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название</FormLabel>
                        <FormControl>
                          <Input placeholder="ООО «Рога и Копыта»" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Телефоны</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <FormField
                        control={form.control}
                        name={`phones.${index}.value`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="+7 (999) 123-45-67" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />
                    {fields.length > 1 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    )}
                  </div>
              ))}
              <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: '' })}
              >
                <Plus className="mr-2 h-4 w-4" /> Добавить телефон
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Здание</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                  control={form.control}
                  name="building_id"
                  render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <BuildingSelect
                              value={field.value ?? null}
                              onChange={(v) => field.onChange(v ?? undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Виды деятельности</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                  control={form.control}
                  name="activities"
                  render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ActivityTreeSelect
                              multiple
                              value={field.value}
                              onChange={(v) => field.onChange(v ?? [])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </Form>
  );
}