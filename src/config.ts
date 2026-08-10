export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const getFileUrl = (path: string) => {
  if (!path) return '#';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_URL}${path}`;
};
