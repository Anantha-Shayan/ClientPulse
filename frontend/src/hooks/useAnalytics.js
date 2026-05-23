import { useEffect, useState } from 'react';
import * as api from '../services/analytics.api';

export function useAnalytics() {
  const [state, setState] = useState({ overview: null, projects: null, team: [], loading: true });
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    Promise.all([api.getOverview(), api.getProjectAnalytics(), api.getTeamAnalytics()])
      .then(([overview, projects, team]) => setState({ overview: overview.data, projects: projects.data, team: team.data, loading: false }))
      .catch(() => setState((s) => ({ ...s, loading: false })));
  }, [reloadKey]);
  return { ...state, refetch: () => setReloadKey((key) => key + 1) };
}
