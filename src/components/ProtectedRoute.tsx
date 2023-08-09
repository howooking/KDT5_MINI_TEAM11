import { AccessTokenAtom } from '@/recoil/AccessTokkenAtom';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

export default function ProtectedRoute() {
  const accessToken = useRecoilValue(AccessTokenAtom);

  if (accessToken) {
    return <Outlet />;
  }
  return <Navigate to={'/'} replace />;
}
