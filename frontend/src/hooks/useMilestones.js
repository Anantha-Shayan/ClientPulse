import { useEffect, useState } from 'react';
import { listMilestones } from '../services/milestone.api';

export function useMilestones(projectId) {
  const [state, setState] = useState({ data: [], loading: true });
  useEffect(() => {
    if (!projectId) {
      setState({ data: [], loading: false });
      return;
    }
    setState({ data: [], loading: true });
    listMilestones(projectId).then((res) => setState({ data: res.data, loading: false })).catch(() => setState({ data: [], loading: false }));
  }, [projectId]);
  return state;
}
