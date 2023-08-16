import { Button } from 'antd';
import { useRecoilValue } from 'recoil';
import { IsLoadingAtom } from '@/recoil/EmailRecoil';
import { EmailVerificationProps } from './email';

interface props extends EmailVerificationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reLoading: any;
}

export default function EmailVerification({
  handleVerificationEmail,
  reLoading,
}: props) {
  const isLoading = useRecoilValue(IsLoadingAtom);

  return (
    <>
      {/* 인증 번호 전송 버튼 */}
      <Button
        type="primary"
        onClick={handleVerificationEmail}
        disabled={isLoading || reLoading}
        loading={isLoading || reLoading}
      >
        인증번호 전송
      </Button>
    </>
  );
}
