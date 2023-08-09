import { IsManagerAtom } from '@/recoil/IsManagerAtom';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

export default function ProtectedManagerRoute() {
  const isManager = useRecoilValue(IsManagerAtom);

  if (isManager) {
    return <Outlet />;
  }
  return <Navigate to={'/'} replace />;
}
