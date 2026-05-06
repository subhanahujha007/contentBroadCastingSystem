import { CalendarClock, ImageOff, Timer } from 'lucide-react';
import { formatDateTime } from '../../utils/date';
import { Modal } from '../ui/Modal';
import { StatusBadge } from '../ui/StatusBadge';

export function BroadcastPreviewModal({ item, open, onClose, title = 'Broadcast preview' }) {
  return (
    <Modal maxWidth="max-w-4xl" onClose={onClose} open={open} title={title}>
      <article className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950 text-white">
        {item?.previewUrl ? (
          <img alt={item.title || 'Content preview'} className="aspect-video w-full object-cover" src={item.previewUrl} />
        ) : (
          <div className="grid aspect-video w-full place-items-center bg-slate-900 text-slate-400">
            <div className="text-center">
              <ImageOff className="mx-auto" size={40} aria-hidden="true" />
              <p className="mt-3 text-sm font-bold">No image selected</p>
            </div>
          </div>
        )}
        <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {item?.status ? <StatusBadge status={item.status} /> : null}
              {item?.subject ? <span className="badge bg-white text-slate-900">{item.subject}</span> : null}
            </div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">{item?.title || 'Untitled broadcast'}</h2>
            {item?.description ? <p className="mt-3 text-slate-300">{item.description}</p> : null}
            {item?.teacherName ? <p className="mt-3 text-sm font-bold text-slate-400">By {item.teacherName}</p> : null}
          </div>
          <div className="rounded-lg bg-slate-900 p-4 text-sm text-slate-300">
            <p className="flex items-center gap-2 font-bold text-white">
              <CalendarClock size={16} aria-hidden="true" />
              Schedule
            </p>
            <p className="mt-2">{formatDateTime(item?.startTime)}</p>
            <p>{formatDateTime(item?.endTime)}</p>
            <p className="mt-3 flex items-center gap-2">
              <Timer size={16} aria-hidden="true" />
              Rotation: {item?.rotationDuration || 15}s
            </p>
          </div>
        </div>
      </article>
    </Modal>
  );
}
