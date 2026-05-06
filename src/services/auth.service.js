import { mockRequest } from './apiClient';
import { clearSession, readStore, writeStore } from './storage';

function sanitizeUser(user) {
  if (!user) return null;
  const { password, passwordHash, ...safeUser } = user;
  return safeUser;
}

function hashMockPassword(value) {
  let hash = 2166136261;
  for (const char of value || '') {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export const authService = {
  login(credentials) {
    return mockRequest(() => {
      const users = readStore('users', []);
      const user = users.find((item) => item.email.toLowerCase() === credentials.email.toLowerCase());

      if (!user || user.passwordHash !== hashMockPassword(credentials.password)) {
        throw new Error('Invalid email or password.');
      }

      const session = {
        token: `mock-token-${user.role}-${Date.now()}`,
        user: sanitizeUser(user),
      };
      writeStore('session', session);
      return session;
    }, { delay: 600 });
  },

  getCurrentSession() {
    return readStore('session', null);
  },

  logout() {
    clearSession();
  },
};
