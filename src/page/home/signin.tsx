import {
  Button,
  Typography,
  Form,
  Input,
  Space,
  message,
  FormInstance,
} from 'antd';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { AccessTokenAtom } from '@/recoil/AccessTokkenAtom';
import { signin } from '@/api/auth/signin';
import { setAccessTokenToCookie } from '@/utils/cookies';
import getPayloadFromJWT from '@/utils/getPayloadFromJWT';
import { IsManagerAtom } from '@/recoil/IsManagerAtom';
const { Text } = Typography;

export default function Signin({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // 매니저 여부를 로그인시 recoil에 저장하기 위해
  const setIsManager = useSetRecoilState(IsManagerAtom);
  // const [accessToken, setAccessToken] = useRecoilState(AccessTokenAtom); 에서 원하는 것만 분리해서 가져올 수 있음
  const setAccessToken = useSetRecoilState(AccessTokenAtom);

  // 로그인 성공 후 form초기화를 위해
  const formRef = useRef<FormInstance>(null);

  // antd message(화면 상단에 뜨는 메세지)기능
  const [messageApi, contextHolder] = message.useMessage();

  // 로그인 통신 과정 로딩 ui
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignin = async (values: {
    userEmail: string;
    userPassword: string;
  }) => {
    // 로딩시작
    setIsSigningIn(true);
    try {
      const response = await signin(values);
      // 로그인 성공
      if (response.status === 200) {
        const { accessToken } = response.data.response;

        // accessToken 쿠키에 저장
        setAccessTokenToCookie(accessToken);
        // recoil에 저장
        setAccessToken(accessToken);

        // 매니저인지 아닌지 확인
        const isManager = getPayloadFromJWT(accessToken).roles[0] === 'MANAGER';
        // 리코일에 매니저 여부 저장
        setIsManager(isManager);

        // 안내메시지
        messageApi.open({
          type: 'success',
          content: '로그인 하였습니다.',
        });

        // 로그인 모달 닫기
        setIsModalOpen(false);

        // 로그인 폼 초기화(로그아웃을 바로 할 경우 폼에 입력값이 남아있음)
        // antd에서 form value값에 접근하는 법을 모르겠음.
        if (formRef.current) {
          formRef.current.resetFields();
        }
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content:
          error.response?.data.error.message ||
          '로그인에 실패하였습니다. 관리자에게 문의하세요.',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div>
      {contextHolder}
      <Form
        layout="vertical"
        name="basic"
        wrapperCol={{ span: 30, offset: 0 }}
        onFinish={handleSignin}
        ref={formRef}
      >
        <Form.Item label="이메일 (관리자: jw@naver.com)" name="userEmail">
          <Input size="large" />
        </Form.Item>
        <Form.Item label="비밀번호 (password1234!@)" name="userPassword">
          <Input.Password size="large" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          style={{ width: '100%' }}
          disabled={isSigningIn}
          loading={isSigningIn}
        >
          로그인
        </Button>
        <Space style={{ marginTop: 10 }}>
          <Text>아직 회원가입을 하지 않으셨나요?</Text>
          <Link to="/signup">회원가입</Link>
        </Space>
      </Form>
    </div>
  );
}
