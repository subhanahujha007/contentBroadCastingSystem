import { mockRequest } from './apiClient';
import { clearSession, readStore, writeStore } from './storage';

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export const authService = {
  login(credentials) {
    return mockRequest(() => {
      const users = readStore('users', []);
      const user = users.find((item) => item.email.toLowerCase() === credentials.email.toLowerCase());

      if (!user || user.password !== credentials.password) {
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
