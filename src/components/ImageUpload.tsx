import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  onImageRemoved: () => void;
  uploadedImage?: string;
  maxSize?: number; // in bytes
  bucketName?: string;
}

export const ImageUpload = ({ 
  onImageUploaded, 
  onImageRemoved, 
  uploadedImage, 
  maxSize = 2 * 1024 * 1024, // 2MB default
  bucketName = 'images' 
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      const maxSizeText = maxSizeMB < 1 ? `${Math.round(maxSize / 1024)} кб` : `${maxSizeMB} мб`;
      toast.error(`Размер файла не должен превышать ${maxSizeText}`);
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      onImageUploaded(data.publicUrl);
      toast.success('Изображение загружено успешно');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onImageRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {uploadedImage ? (
        <div className="relative">
          <img 
            src={uploadedImage} 
            alt="Uploaded" 
            className="max-w-full h-40 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Загрузка...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4 mr-2" />
              {t('question.attachImage')}
            </>
          )}
        </Button>
      )}
    </div>
  );
};