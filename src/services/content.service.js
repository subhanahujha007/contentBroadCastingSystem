import { CONTENT_STATUS } from '../utils/constants';
import { getScheduleState } from '../utils/date';
import { mockRequest, requireSession } from './apiClient';
import { readStore, writeStore } from './storage';

function normalizeList(value) {
  return Array.isArray(value) ? value : [];
}

function makeSummary(items) {
  return {
    total: items.length,
    pending: items.filter((item) => item.status === CONTENT_STATUS.PENDING).length,
    approved: items.filter((item) => item.status === CONTENT_STATUS.APPROVED).length,
    rejected: items.filter((item) => item.status === CONTENT_STATUS.REJECTED).length,
  };
}

export const contentService = {
  listAll({ status = 'all', search = '', teacherId } = {}) {
    return mockRequest(() => {
      requireSession();
      const query = search.trim().toLowerCase();
      let items = normalizeList(readStore('content', []));

      if (teacherId) items = items.filter((item) => item.teacherId === teacherId);
      if (status !== 'all') items = items.filter((item) => item.status === status);
      if (query) {
        items = items.filter((item) =>
          [item.title, item.subject, item.teacherName].some((value) => String(value || '').toLowerCase().includes(query)),
        );
      }

      return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });
  },

  listForTeacher(teacherId) {
    return this.listAll({ teacherId });
  },

  getSummary({ teacherId } = {}) {
    return mockRequest(() => {
      requireSession();
      let items = normalizeList(readStore('content', []));
      if (teacherId) items = items.filter((item) => item.teacherId === teacherId);
      return makeSummary(items);
    });
  },

  createContent(payload) {
    return mockRequest(() => {
      const session = requireSession();
      const file = payload.file;
      const now = new Date().toISOString();
      const previewUrl = payload.previewUrl || '';
      const items = normalizeList(readStore('content', []));

      const record = {
        id: `content-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`,
        teacherId: session.user.id,
        teacherName: session.user.name,
        title: payload.title,
        subject: payload.subject,
        description: payload.description || '',
        fileName: file?.name || 'uploaded-image',
        fileType: file?.type || 'image/png',
        fileSize: file?.size || 0,
        previewUrl,
        status: CONTENT_STATUS.PENDING,
        rejectionReason: '',
        startTime: payload.startTime,
        endTime: payload.endTime,
        rotationDuration: Number(payload.rotationDuration || 15),
        createdAt: now,
        updatedAt: now,
      };

      writeStore('content', [record, ...items]);
      return record;
    }, { delay: 800 });
  },

  getLiveContent(teacherId) {
    return mockRequest(() => {
      const items = normalizeList(readStore('content', []));
      const active = items
        .filter((item) => item.teacherId === teacherId)
        .filter((item) => item.status === CONTENT_STATUS.APPROVED)
        .filter((item) => getScheduleState(item) === 'active')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      return active[0] || null;
    }, { delay: 500 });
  },
};
