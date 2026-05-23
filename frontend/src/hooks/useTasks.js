import { useEffect, useState } from 'react';
import { listTasks } from '../services/task.api';

export function useTasks(milestones = []) {
  const [state, setState] = useState({ data: [], loading: true });
  useEffect(() => {
    if (!milestones.length) {
      setState({ data: [], loading: false });
      return;
    }
    Promise.all(milestones.map((m) => listTasks(m.id).then((res) => res.data))).then((groups) => setState({ data: groups.flat(), loading: false })).catch(() => setState({ data: [], loading: false }));
  }, [milestones]);
  return state;
}
