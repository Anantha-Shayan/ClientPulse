export const formatDate = (value) => {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(value));
};
