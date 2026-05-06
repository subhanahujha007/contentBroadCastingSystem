import axios from 'axios';
import { readStore } from './storage';

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/mock-api',
  timeout: 12000,
});

apiClient.interceptors.request.use((config) => {
  const session = readStore('session', null);
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

export function requireSession() {
  const session = readStore('session', null);
  if (!session?.token || !session?.user) {
    throw new Error('Please log in to continue.');
  }
  return session;
}

export async function mockRequest(handler, options = {}) {
  const delay = options.delay ?? 450;
  await new Promise((resolve) => setTimeout(resolve, delay));

  try {
    return await handler();
  } catch (error) {
    const message = error?.message || 'Something went wrong. Please try again.';
    throw new Error(message);
  }
}
