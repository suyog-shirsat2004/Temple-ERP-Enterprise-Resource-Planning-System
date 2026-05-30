const BASE = import.meta.env.BASE_URL || '/';

export const asset = (path) => {
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE}${clean}`;
};
