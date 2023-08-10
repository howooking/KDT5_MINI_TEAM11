import { ConfigProvider } from 'antd';
import { Route, Routes } from 'react-router-dom';
import koKR from 'antd/locale/ko_KR';
import MyLayout from '@/components/MyLayout';
import Home from '@/page/home/home';
import ProtectedRoute from '@/components/ProtectedRoute';
import MyAccountLayout from '@/page/myAccount/myAccoutLayout';
import MyAccount from '@/page/myAccount/myAccount';
import Vacation from '@/page/myAccount/vacation';
import ProtectedManagerRoute from '@/components/ProtectedManagerRoute';
import AdminLayout from '@/page/myAccount/admin/adminLayout';
import Approve from '@/page/myAccount/admin/approve';
import Promote from '@/page/myAccount/admin/promote';
import NotFound from '@/page/notFound/notFountd';
import Signup from '@/page/signup/signup';

export default function App() {
  const theme = {
    token: {
      colorPrimary: '#03bafc',
    },
  };

  return (
    <ConfigProvider theme={theme} locale={koKR}>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route element={<MyLayout />}>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MyAccountLayout />}>
              <Route path="/myaccount" element={<MyAccount />} />
              <Route path="myaccount/vacation" element={<Vacation />} />
              <Route element={<ProtectedManagerRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="myaccount/approve" element={<Approve />} />
                  <Route path="myaccount/promote" element={<Promote />} />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
}
