import { Button } from 'antd';
import { EmailProps } from './email';
import { checkEmail } from '@/api/auth/checkEmail';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { IsEmailCheckAtom, IsLoadingAtom } from '@/recoil/EmailRecoil';

export default function EmailChecked({ messageApi, form }: EmailProps) {
  const [isLoading, setIsLoading] = useRecoilState(IsLoadingAtom);
  const setIsEmailCheck = useSetRecoilState(IsEmailCheckAtom);
  // 이메일 중복체크
  const handleCheckEmail = async () => {
    setIsLoading(true);
    try {
      // userEmail form을 찾아서
      const values = await form.validateFields(['userEmail']);
      // userEmail을 가져옴
      const userEmail = values.userEmail;
      // checkEmail에 userEmail을 매개변수로 전달달
      const response = await checkEmail(userEmail);

      if (response.data.success) {
        setIsEmailCheck(true); // 중복되지 않은 이메일일 경우
        messageApi.open({
          type: 'success',
          content: '사용 가능한 이메일입니다.',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content:
          error.response?.data.error.message ||
          '이메일 중복체크에 실패하였습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {/* 이메일 중복 체크 버튼 */}
      <Button
        type="primary"
        onClick={handleCheckEmail}
        disabled={isLoading}
        loading={isLoading}
      >
        이메일 중복 체크
      </Button>
    </>
  );
}
