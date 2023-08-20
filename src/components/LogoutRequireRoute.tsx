import { AccessTokenAtom } from '@/recoil/AccessTokkenAtom';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

export default function LogoutRequireRoute() {
  const accessToken = useRecoilValue(AccessTokenAtom);

  if (accessToken) {
    return <Navigate to={'/'} replace />;
  }
  return <Outlet />;
}
