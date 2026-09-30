import { API_BASE_URL } from '@/api/config';

export const toAbsolute = (url: string) => {
  if (/^https?:\/\//i.test(url)) return url;
  const apiOrigin = new URL(API_BASE_URL, window.location.origin).origin;
  return new URL(url, `${apiOrigin}/`).href;
};
