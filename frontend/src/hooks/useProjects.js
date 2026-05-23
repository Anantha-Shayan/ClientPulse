import { useEffect, useState } from 'react';
import * as projectApi from '../services/project.api';

export function useProjects(mode = 'admin') {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  useEffect(() => {
    const fn = mode === 'member' ? projectApi.listMyProjects : mode === 'client' ? projectApi.getClientProject : projectApi.listProjects;
    fn().then((res) => setState({ data: Array.isArray(res.data) ? res.data : [res.data].filter(Boolean), loading: false, error: null })).catch((error) => setState({ data: [], loading: false, error }));
  }, [mode]);
  return state;
}
