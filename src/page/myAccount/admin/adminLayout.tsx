import { ArrowUpOutlined, CheckOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const items: MenuProps['items'] = [
    {
      label: '연차 / 당직 승인',
      key: '/myaccount/approve',
      icon: <CheckOutlined />,
      onClick: () => navigate('/myaccount/approve'),
    },
    {
      label: '사원 직책 변경',
      key: '/myaccount/promote',
      icon: <ArrowUpOutlined />,
      onClick: () => navigate('/myaccount/promote'),
    },
  ];

  return (
    <>
      <Menu selectedKeys={[pathname]} mode="horizontal" items={items} />
      <Outlet />
    </>
  );
}
