import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, ImagePlus, UploadCloud } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { BroadcastPreviewModal } from '../../components/content/BroadcastPreviewModal';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/ui/FormField';
import { PageHeader } from '../../components/ui/PageHeader';
import { contentService } from '../../services/content.service';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES, SUBJECTS } from '../../utils/constants';
import { toLocalInputValue } from '../../utils/date';

const uploadSchema = z
  .object({
    title: z.string().min(1, 'Title is required.'),
    subject: z.string().min(1, 'Subject is required.'),
    description: z.string().optional(),
    file: z
      .any()
      .refine((files) => files?.length === 1, 'File is required.')
      .refine((files) => !files?.[0] || ACCEPTED_IMAGE_TYPES.includes(files[0].type), 'Only JPG, PNG, or GIF files are allowed.')
      .refine((files) => !files?.[0] || files[0].size <= MAX_FILE_SIZE_BYTES, 'File size must be 10MB or less.'),
    startTime: z.string().min(1, 'Start time is required.'),
    endTime: z.string().min(1, 'End time is required.'),
    rotationDuration: z.coerce.number().min(5, 'Minimum rotation duration is 5 seconds.').max(300, 'Maximum rotation duration is 300 seconds.'),
  })
  .refine((values) => new Date(values.endTime) > new Date(values.startTime), {
    message: 'End time must be after start time.',
    path: ['endTime'],
  });

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read selected file.'));
    reader.readAsDataURL(file);
  });
}

export function UploadContentPage() {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState('');
  const [showDisplayPreview, setShowDisplayPreview] = useState(false);
  const now = useMemo(() => new Date(), []);
  const later = useMemo(() => new Date(now.getTime() + 3 * 60 * 60 * 1000), [now]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      subject: '',
      description: '',
      startTime: toLocalInputValue(now),
      endTime: toLocalInputValue(later),
      rotationDuration: 15,
    },
  });

  const selectedFile = watch('file')?.[0];
  const draftPreview = {
    title: watch('title'),
    subject: watch('subject'),
    description: watch('description'),
    previewUrl,
    status: 'pending',
    startTime: watch('startTime'),
    endTime: watch('endTime'),
    rotationDuration: watch('rotationDuration'),
  };

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl('');
      return;
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE_BYTES) {
      setPreviewUrl('');
      return;
    }
    setPreviewUrl(await fileToDataUrl(file));
  }

  async function onSubmit(values) {
    try {
      const dataUrl = previewUrl || (values.file?.[0] ? await fileToDataUrl(values.file[0]) : '');
      await contentService.createContent({
        ...values,
        file: values.file[0],
        previewUrl: dataUrl,
      });
      toast.success('Content uploaded for principal approval.');
      navigate('/teacher/content');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <PageHeader description="Add subject content, schedule it, and submit it for review." title="Upload Content" />

      <form className="card grid gap-5 p-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5 lg:grid-cols-2">
          <FormField error={errors.title?.message} label="Title">
            <input className="input" placeholder="Morning algebra recap" {...register('title')} />
          </FormField>
          <FormField error={errors.subject?.message} label="Subject">
            <select className="input" {...register('subject')}>
              <option value="">Select subject</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField error={errors.description?.message} label="Description">
          <textarea className="input min-h-24 resize-y" placeholder="Add optional context for the principal" {...register('description')} />
        </FormField>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-5">
            <FormField error={errors.file?.message} label="File upload">
              <input accept=".jpg,.jpeg,.png,.gif" className="input" type="file" {...register('file', { onChange: handleFileChange })} />
            </FormField>
            <div className="grid gap-5 md:grid-cols-3">
              <FormField error={errors.startTime?.message} label="Start time">
                <input className="input" type="datetime-local" {...register('startTime')} />
              </FormField>
              <FormField error={errors.endTime?.message} label="End time">
                <input className="input" type="datetime-local" {...register('endTime')} />
              </FormField>
              <FormField error={errors.rotationDuration?.message} label="Rotation duration">
                <input className="input" min="5" type="number" {...register('rotationDuration')} />
              </FormField>
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
            {previewUrl ? (
              <img alt="Selected content preview" className="aspect-video w-full rounded-lg object-cover" src={previewUrl} />
            ) : (
              <div className="grid aspect-video place-items-center rounded-lg bg-white text-center text-slate-500">
                <div>
                  <ImagePlus className="mx-auto" size={30} aria-hidden="true" />
                  <p className="mt-2 text-sm font-bold">Preview appears here</p>
                </div>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-bold text-slate-700">{selectedFile?.name || 'No file selected'}</p>
              <Button className="min-h-9 px-3" disabled={!previewUrl} onClick={() => setShowDisplayPreview(true)} variant="secondary">
                <Eye size={16} aria-hidden="true" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button loading={isSubmitting} type="submit">
            <UploadCloud size={17} aria-hidden="true" />
            Submit for approval
          </Button>
        </div>
      </form>
      <BroadcastPreviewModal
        item={draftPreview}
        onClose={() => setShowDisplayPreview(false)}
        open={showDisplayPreview}
        title="Upload content preview"
      />
    </>
  );
}
