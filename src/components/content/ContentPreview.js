import { ImageOff } from 'lucide-react';

export function ContentPreview({ item, compact = false }) {
  if (!item?.previewUrl) {
    return (
      <div className={`grid place-items-center rounded-lg bg-slate-100 text-slate-500 ${compact ? 'h-14 w-20' : 'aspect-video w-full'}`}>
        <ImageOff size={compact ? 18 : 32} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      alt={item.title || 'Content preview'}
      className={`rounded-lg object-cover ${compact ? 'h-14 w-20' : 'aspect-video w-full'}`}
      loading="lazy"
      src={item.previewUrl}
    />
  );
}
