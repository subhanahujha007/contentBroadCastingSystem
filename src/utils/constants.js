export const ROLES = {
  PRINCIPAL: 'principal',
  TEACHER: 'teacher',
};

export const CONTENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Computer Science', 'Art'];

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: CONTENT_STATUS.PENDING },
  { label: 'Approved', value: CONTENT_STATUS.APPROVED },
  { label: 'Rejected', value: CONTENT_STATUS.REJECTED },
];
