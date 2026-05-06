import { memo } from 'react';
import { formatDateTime, getScheduleState } from '../../utils/date';
import { ContentPreview } from './ContentPreview';
import { StatusBadge } from '../ui/StatusBadge';

export const ContentTable = memo(function ContentTable({ items, actions, showTeacher = false }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Preview</th>
            <th>Content</th>
            {showTeacher ? <th>Teacher</th> : null}
            <th>Status</th>
            <th>Schedule</th>
            <th>Rotation</th>
            {actions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <ContentPreview compact item={item} />
              </td>
              <td>
                <p className="font-extrabold text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.subject}</p>
                {item.rejectionReason ? <p className="mt-2 text-sm text-rose-700">{item.rejectionReason}</p> : null}
              </td>
              {showTeacher ? <td className="text-sm text-slate-700">{item.teacherName}</td> : null}
              <td>
                <div className="flex flex-col gap-2">
                  <StatusBadge status={item.status} />
                  {item.status === 'approved' ? <StatusBadge status={getScheduleState(item)} /> : null}
                </div>
              </td>
              <td className="text-sm text-slate-700">
                <p>{formatDateTime(item.startTime)}</p>
                <p className="mt-1 text-slate-500">{formatDateTime(item.endTime)}</p>
              </td>
              <td className="text-sm font-bold text-slate-700">{item.rotationDuration || 15}s</td>
              {actions ? <td>{actions(item)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
