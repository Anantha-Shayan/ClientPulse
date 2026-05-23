export const getHealthColor = (score) => {
  if (score >= 80) return 'bg-leaf text-white';
  if (score >= 50) return 'bg-amber text-white';
  return 'bg-coral text-white';
};

export const getHealthLabel = (score) => {
  if (score >= 80) return 'On Track';
  if (score >= 50) return 'At Risk';
  return 'Critical';
};
