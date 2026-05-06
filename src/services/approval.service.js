import { CONTENT_STATUS } from '../utils/constants';
import { mockRequest, requireSession } from './apiClient';
import { readStore, writeStore } from './storage';

function updateContent(id, updater) {
  const items = Array.isArray(readStore('content', [])) ? readStore('content', []) : [];
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error('Content item was not found.');
  }

  const updated = {
    ...items[index],
    ...updater(items[index]),
    updatedAt: new Date().toISOString(),
  };
  const next = [...items];
  next[index] = updated;
  writeStore('content', next);
  return updated;
}

export const approvalService = {
  approve(id) {
    return mockRequest(() => {
      const session = requireSession();
      if (session.user.role !== 'principal') throw new Error('Only principals can approve content.');

      return updateContent(id, () => ({
        status: CONTENT_STATUS.APPROVED,
        rejectionReason: '',
      }));
    }, { delay: 550 });
  },

  reject(id, reason) {
    return mockRequest(() => {
      const session = requireSession();
      if (session.user.role !== 'principal') throw new Error('Only principals can reject content.');
      if (!reason?.trim()) throw new Error('Rejection reason is required.');

      return updateContent(id, () => ({
        status: CONTENT_STATUS.REJECTED,
        rejectionReason: reason.trim(),
      }));
    }, { delay: 550 });
  },
};
