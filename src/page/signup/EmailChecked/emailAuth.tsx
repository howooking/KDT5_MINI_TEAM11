import { Button, Input, Space, message } from 'antd';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  IsLoadingAtom,
  ResendAtom,
  EmailVerifiedAtom,
  TimerAtom,
} from '@/recoil/EmailRecoil';
import { EmailVerificationProps } from './email';
import { checkEmailAuth } from '@/api/auth/checkEmail';

interface EmailAuthProps extends EmailVerificationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
}

export default function EmailAuth({
  form,
  handleVerificationEmail,
}: EmailAuthProps) {
  const [isLoading, setIsLoading] = useRecoilState(IsLoadingAtom);
  const [reSend, setReSend] = useRecoilState(ResendAtom);
  const setEmailVerified = useSetRecoilState(EmailVerifiedAtom);
  const setTimer = useSetRecoilState(TimerAtom);

  // 이메일 인증번호 발송 받은 번호를 인증
  const handleEmailAuth = async () => {
    try {
      const userEmailData = await form.validateFields(['userEmail']);
      const userEmail = userEmailData.userEmail;
      const emailAuthData = await form.validateFields(['emailAuth']);
      const userEmailAuth = emailAuthData.emailAuth;
      const data = { userEmail, userEmailAuth };
      const response = await checkEmailAuth(data);

      if (response.data.success) {
        message.success('이메일 인증 성공!');
        setEmailVerified(true);
        setTimer(0);
      } else {
        message.error('이메일 인증 실패!');
      }
    } catch (error) {
      message.error('서버 요청에 실패하였습니다.');
    }
  };

  const handleReSend = async () => {
    if (reSend) {
      setIsLoading(true);
      try {
        setReSend(false);
        await handleVerificationEmail();
      } catch (error) {
        console.error('이메일 인증 요청 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <>
      <Space>
        <Input placeholder="인증번호를 입력해주세요." />
        <Button
          type="primary"
          onClick={handleEmailAuth}
          disabled={isLoading}
          loading={isLoading}
        >
          제출
        </Button>
        <Button
          type="primary"
          onClick={handleReSend}
          disabled={!reSend}
          loading={isLoading}
        >
          재발송
        </Button>
      </Space>
    </>
  );
}
