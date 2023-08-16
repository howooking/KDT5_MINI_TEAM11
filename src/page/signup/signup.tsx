import { Card, message } from 'antd';
import SignupForm from './signupForm';

export default function Signup() {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <div
      style={{
        background: '#eee',
        height: '100vh',
        boxSizing: 'border-box',
        padding: 70,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {contextHolder}
      <Card bordered={false} style={{ width: 500 }}>
        <SignupForm messageApi={messageApi} />
      </Card>
    </div>
  );
}
