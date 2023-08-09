import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
import MyHeader from '@/components/MyHeader';

export default function MyLayout() {
  return (
    <Layout
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      <MyHeader />
      <Content
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}
