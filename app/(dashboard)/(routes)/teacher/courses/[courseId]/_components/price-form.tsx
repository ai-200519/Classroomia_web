'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface PriceFormProps {
  initialData: {
    price: number | null;
  };
  courseId: string;
}

const priceFormSchema = z.object({
  price: z.preprocess(
    (a) => parseFloat(a as string),
    z
      .number({ invalid_type_error: 'Expected number' })
      .nonnegative('Le nombre doit être égal ou supérieur à 0'),
  ),
});

type PriceFormSchemaType = z.infer<typeof priceFormSchema>;

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<PriceFormSchemaType>({
    mode: 'onChange',
    defaultValues: { price: initialData?.price || 0 },
    resolver: zodResolver(priceFormSchema),
  });

  const { isValid, isSubmitting } = form.formState;

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: PriceFormSchemaType) => {
    try {
      console.log({ values });
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Le cours est actualisé');
      toggleIsEditing();
      router.refresh();
    } catch {
      toast.error('Une erreur est survenue lors de la mise à jour du cours');
    }
  };

  return (
    <div className='mt-6 rounded-md border bg-slate-100 p-4'>
      <div className='flex items-center justify-between font-medium'>
        Prix du Coursus
        <Button onClick={toggleIsEditing}>
          {isEditing ? (
            'Annuler'
          ) : (
            <>
              <PencilIcon className='mr-2 h-4 w-4' />
              Modifier
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'mt-2 text-sm',
            initialData.price ?? 'italic text-slate-500',
          )}>
          {initialData.price !== null
            ? formatPrice(initialData.price)
            : 'Prix non défini'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4 space-y-4'>
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type='number'
                      step={0.01}
                      min={0}
                      placeholder='Définissez un prix pour votre cours'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                Sauvegarder
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PriceForm;