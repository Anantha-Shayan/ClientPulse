import { createContext, useEffect, useMemo, useReducer } from 'react';
import toast from 'react-hot-toast';
import * as authApi from '../services/auth.api';

export const AuthContext = createContext(null);

const initialState = { user: null, token: null, loading: true };
const authStorageKey = 'clientpulse.authenticated';

const reducer = (state, action) => {
  switch (action.type) {
    case 'ready':
      return { ...state, loading: false, user: action.user || null };
    case 'login':
      return { ...state, user: action.user, token: action.token, loading: false };
    case 'logout':
      return { ...initialState, loading: false };
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (localStorage.getItem(authStorageKey) !== 'true') {
      dispatch({ type: 'ready' });
      return;
    }

    authApi.me()
      .then((res) => dispatch({ type: 'ready', user: res.data }))
      .catch(() => {
        localStorage.removeItem(authStorageKey);
        dispatch({ type: 'ready' });
      });
  }, []);

  const value = useMemo(() => ({
    ...state,
    login: async (payload) => {
      const res = await authApi.login(payload);
      localStorage.setItem(authStorageKey, 'true');
      dispatch({ type: 'login', user: res.data.user, token: res.data.token });
      toast.success('Signed in');
      return res.data.user;
    },
    logout: async () => {
      await authApi.logout().catch(() => null);
      localStorage.removeItem(authStorageKey);
      dispatch({ type: 'logout' });
      toast.success('Signed out');
    }
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
