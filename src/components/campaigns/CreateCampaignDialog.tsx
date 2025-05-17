
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

export interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function CreateCampaignDialog({ open, onOpenChange, onSubmit }: CreateCampaignDialogProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      target: '',
    }
  });

  const onSubmitHandler = async (data: any) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать новую кампанию</DialogTitle>
          <DialogDescription>
            Заполните форму для создания новой кампании
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название кампании</Label>
            <Input 
              id="name" 
              {...register('name', { required: 'Название обязательно' })} 
              placeholder="Введите название кампании"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea 
              id="description" 
              {...register('description')} 
              placeholder="Опишите цель кампании"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Целевая аудитория</Label>
            <Input 
              id="target" 
              {...register('target')} 
              placeholder="Определите целевую аудиторию"
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Создание...' : 'Создать кампанию'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
