import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
import MyHeader from '@/components/MyHeader';

export default function MyLayout() {
  return (
    <Layout>
      <MyHeader />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}
