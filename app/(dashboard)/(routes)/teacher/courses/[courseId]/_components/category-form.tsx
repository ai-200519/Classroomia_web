'use client';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface CategoryFormProps {
  initialData: {
    categoryId: string | null;
  };
  courseId: string;
  options: { name: string; id: string }[];
}

const categoryFormSchema = z.object({
  categoryId: z.string().trim().min(1, 'Catégorie est obligatoire'),
});

type CategoryFormSchemaType = z.infer<typeof categoryFormSchema>;

const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<CategoryFormSchemaType>({
    mode: 'onChange',
    defaultValues: { categoryId: initialData?.categoryId || '' },

    resolver: zodResolver(categoryFormSchema),
  });

  const { isValid, isSubmitting } = form.formState;

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: CategoryFormSchemaType) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Le cours est actualisé');
      toggleIsEditing();
      router.refresh();
    } catch {
      toast.error('Une erreur est survenue lors de la mise à jour du cours');
    }
  };

  const selectedCategory = options.find(
    (category) => category.id === initialData.categoryId,
  )?.name;

  return (
    <div className='mt-6 rounded-md border bg-slate-100 p-4'>
      <div className='flex items-center justify-between font-medium'>
        Catégorie
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
            !initialData.categoryId && 'italic text-slate-500',
          )}>
          {selectedCategory || 'No category'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4 space-y-4'>
            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options.map(option => ({ label: option.name, value: option.id }))}
                      value={field.value}
                      onChange={field.onChange}
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

export default CategoryForm;