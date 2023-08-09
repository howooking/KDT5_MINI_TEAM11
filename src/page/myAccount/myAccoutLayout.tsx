import { Layout, Menu, MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { IsManagerAtom } from '@/recoil/IsManagerAtom';

const { Content, Sider } = Layout;

export default function MyAccountLayout() {
  const { pathname } = useLocation();
  const [selectedMenuKey, setSelectedMenuKey] = useState(() => pathname);

  const navigate = useNavigate();

  // 현재 접속중인 url의 뒷부분을 가져옴
  const isManager = useRecoilValue(IsManagerAtom);

  const items: MenuProps['items'] = [
    {
      key: 1,
      label: '내 정보',
      onClick: () => {
        navigate('/myaccount');
        setSelectedMenuKey('/myaccount');
      },
    },
    {
      key: 2,
      label: '내 연차/당직',
      onClick: () => {
        navigate('/myaccount/vacation');
        setSelectedMenuKey('/myaccount/vacation');
      },
    },
    {
      key: 3,
      label: '관리자',
      onClick: () => {
        navigate('/myaccount/approve');
        setSelectedMenuKey('/myaccount/admin');
      },
    },
  ];

  return (
    <Layout>
      <Sider
        width={200}
        style={{ minHeight: 'calc(100vh - 60px) ', background: 'white' }}
      >
        <Menu
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
          items={isManager ? items : items.splice(0, 2)}
          selectedKeys={[pathname === selectedMenuKey ? selectedMenuKey : '']}
        />
      </Sider>
      <Layout style={{ padding: 20 }}>
        <Content
          style={{
            background: 'white',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
