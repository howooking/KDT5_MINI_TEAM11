import { Layout, Menu, MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { IsManagerAtom } from '@/recoil/IsManagerAtom';
const { Content, Sider } = Layout;

export default function MyAccountLayout() {
  const { pathname } = useLocation();

  const MY_ACCOUNT_MENU: {
    [key: string]: { key: string };
  } = {
    '/myaccount': {
      key: '1',
    },
    '/myaccount/vacation': {
      key: '2',
    },
    '/myaccount/approve': {
      key: '3',
    },
    '/myaccount/promote': {
      key: '3',
    },
  };

  const [selectedMenuKey, setSelectedMenuKey] = useState(
    MY_ACCOUNT_MENU[pathname].key,
  );

  const navigate = useNavigate();

  // 현재 접속중인 url의 뒷부분을 가져옴
  const isManager = useRecoilValue(IsManagerAtom);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '내 정보',
      onClick: () => {
        navigate('/myaccount');
        setSelectedMenuKey('1');
      },
    },
    {
      key: '2',
      label: '내 연차/당직',
      onClick: () => {
        navigate('/myaccount/vacation');
        setSelectedMenuKey('2');
      },
    },
    {
      key: '3',
      label: '관리자',
      onClick: () => {
        navigate('/myaccount/approve');
        setSelectedMenuKey('3');
      },
    },
  ];

  return (
    <Layout>
      <Sider
        width={300}
        style={{ minHeight: 'calc(100vh - 60px) ', background: 'white' }}
      >
        <Menu
          mode="inline"
          style={{
            height: '100%',
            borderRight: 0,
            textAlign: 'center',
            padding: 20,
          }}
          items={isManager ? items : items.splice(0, 2)}
          selectedKeys={[
            MY_ACCOUNT_MENU[pathname].key === selectedMenuKey
              ? selectedMenuKey
              : '',
          ]}
        />
      </Sider>
      <Layout style={{ paddingLeft: 10 }}>
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
