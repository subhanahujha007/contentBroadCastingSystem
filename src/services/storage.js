import { CONTENT_STATUS, ROLES, SUBJECTS } from '../utils/constants';

const STORAGE_KEYS = {
  users: 'cbs_users',
  content: 'cbs_content',
  session: 'cbs_session',
};

const USERS = [
  {
    id: 'principal-1',
    name: 'Anita Sharma',
    email: 'principal@school.com',
    passwordHash: 'a9e63a98',
    role: ROLES.PRINCIPAL,
  },
  {
    id: 'teacher-1',
    name: 'Ravi Mehta',
    email: 'teacher@school.com',
    passwordHash: 'a9e63a98',
    role: ROLES.TEACHER,
  },
  {
    id: 'teacher-2',
    name: 'Neha Iyer',
    email: 'teacher2@school.com',
    passwordHash: 'a9e63a98',
    role: ROLES.TEACHER,
  },
];

function makeContent(index) {
  const teacher = index % 3 === 0 ? USERS[2] : USERS[1];
  const subject = SUBJECTS[index % SUBJECTS.length];
  const statusCycle = [CONTENT_STATUS.APPROVED, CONTENT_STATUS.PENDING, CONTENT_STATUS.REJECTED, CONTENT_STATUS.APPROVED];
  const status = statusCycle[index % statusCycle.length];
  const start = new Date();
  start.setHours(start.getHours() - (index % 8) + 2);
  start.setMinutes((index * 7) % 60);
  const end = new Date(start);
  end.setHours(start.getHours() + 4 + (index % 5));

  return {
    id: `content-${index + 1}`,
    teacherId: teacher.id,
    teacherName: teacher.name,
    title: `${subject} Broadcast ${index + 1}`,
    subject,
    description: `Short learning visual prepared for ${subject.toLowerCase()} classroom displays.`,
    fileName: `broadcast-${index + 1}.png`,
    fileType: 'image/png',
    fileSize: 240000 + index * 1100,
    previewUrl: `https://picsum.photos/seed/classroom-${index + 1}/640/360`,
    status,
    rejectionReason: status === CONTENT_STATUS.REJECTED ? 'Please improve image clarity and add a more specific title.' : '',
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    rotationDuration: [15, 20, 30, 45][index % 4],
    createdAt: new Date(Date.now() - index * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - index * 1800000).toISOString(),
  };
}

export function initializeStore() {
  const storedUsers = localStorage.getItem(STORAGE_KEYS.users);
  if (!storedUsers || storedUsers.includes('"password"')) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(USERS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.content)) {
    const seededContent = Array.from({ length: 60 }, (_, index) => makeContent(index));
    localStorage.setItem(STORAGE_KEYS.content, JSON.stringify(seededContent));
  }
}

export function readStore(key, fallback) {
  initializeStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key]);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

export { STORAGE_KEYS, USERS };
