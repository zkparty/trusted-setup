import { ReactNode } from "react";
import { Navigate } from 'react-router-dom';
import { shallow } from 'zustand/shallow';

import { useAuthStore } from '../../stores/auth';
import { ROUTES } from '../../router/constants';

type Props = {
  children: ReactNode;
};

const RequireAuth = ({ children }: Props) => {
  const { authenticated } = useAuthStore(
    ({ token }) => ({
      authenticated: !!token, // TODO: check if token has not expired
    }),
    shallow,
  );

  if (!authenticated) {
    return <Navigate to={ROUTES.SIGNIN} replace />;
  }
  return children;
};

export default RequireAuth;