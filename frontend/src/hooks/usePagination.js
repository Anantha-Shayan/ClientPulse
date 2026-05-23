import { useState } from 'react';

export default function usePagination(initial = 1) {
  const [page, setPage] = useState(initial);
  return { page, limit: 20, next: () => setPage((p) => p + 1), prev: () => setPage((p) => Math.max(1, p - 1)), setPage };
}
