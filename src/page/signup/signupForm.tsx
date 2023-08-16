import { useState } from 'react';
import { Button, Input, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { handleUpload } from '@/api/auth/cloudinary';
import { signup } from '@/api/auth/signup';
import { useSetRecoilState } from 'recoil';
import { AccessTokenAtom } from '@/recoil/AccessTokkenAtom';
import { setAccessTokenToCookie } from '@/utils/cookies';
import ButtonGroup from 'antd/es/button/button-group';
import Email from './EmailChecked/email';
import EmailValidation from './EmailValidation/emailValidation';
import PasswordValidation from './PasswordValidation/passwordValidation';
import ProfileImg from './ProfileImageUrl/profileImg';
import SelectPosition from './SelectPostion/selectPosition';
import {
  IsEmailCheckAtom,
  ResendAtom,
  EmailVerifiedAtom,
  VerificationAtom,
} from '@/recoil/EmailRecoil';

interface valuseType {
  confirm_password: string;
  phone: string;
  position: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profileThumbUrl: any;
  userEmail: string;
  userPassword: string;
  userName: string;
}

export interface SignupFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messageApi: any;
}

export default function SignupForm({ messageApi }: SignupFormProps) {
  // 회원가입 통신 과정 로딩 ui
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [form] = Form.useForm();

  const setAccessToken = useSetRecoilState(AccessTokenAtom);
  const navigate = useNavigate();

  const setIsEmailCheck = useSetRecoilState(IsEmailCheckAtom);
  const setReSend = useSetRecoilState(ResendAtom);
  const setEmailVerified = useSetRecoilState(EmailVerifiedAtom);
  const setVerification = useSetRecoilState(VerificationAtom);

  const onFinish = async (values: valuseType) => {
    // 클라우디너리로 전송한 이미지 url 가져옴
    const imageUrl = await getImageUrl(values);

    // 가져온 이미지 url만 profileThumbUrl에 전달하기 위해서
    // values객체를 전개연산자를 이용해서 newValues에 모든 속성을 복사하고,
    // profileThumbUrl: imageUrl을 마지막에 사용해서 덮어 씌움
    const newValues = {
      ...values,
      profileThumbUrl: imageUrl,
    };

    setIsSigningUp(true);
    try {
      const response = await signup(newValues);

      // 로그인 성공
      if (response.status === 200) {
        const { accessToken } = response.data.response;

        // 쿠키에 저장
        setAccessTokenToCookie(accessToken);

        // recoil에 저장
        setAccessToken(accessToken);

        // 안내메시지
        messageApi.open({
          type: 'success',
          content: '회원가입이 완료되었습니다.',
        });

        // 회원가입이 성공한 경우 홈으로 이동
        setTimeout(() => {
          navigate('/');
        }, 1000);

        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content:
          error.response?.data.error.message ||
          '회원가입에 실패하였습니다. 관리자에게 문의하세요.',
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  // cloudinary를 이용해서 이미지url이 없으면 null, 있으면 이미지url을 반환
  const getImageUrl = async (values: valuseType) => {
    let imageUrl = null;

    try {
      if (values.profileThumbUrl && values.profileThumbUrl.length > 0) {
        const response = await handleUpload(
          values.profileThumbUrl[0].originFileObj,
        );
        if (response?.status === 200) {
          const data = response.data;
          imageUrl = data.url; // 이미지 URL을 받아옴
        } else {
          throw new Error('이미지 업로드에 실패하였습니다.');
        }
      }
    } catch (error) {
      console.error('이미지 업로드중 오류 발생:', error);
      imageUrl = null; // 오류가 발생했으므로 imageUrl을 null로 설정
    }

    return imageUrl;
  };

  const goHomeAndResetForm = () => {
    // 홈으로 이동
    navigate('/');
    setIsEmailCheck(false);
    setEmailVerified(false);
    setVerification(false);
    setReSend(false);

    // Form의 값을 초기화
    form.resetFields();
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="basic"
        wrapperCol={{ span: 30, offset: 0 }}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          hasFeedback
          label="이름"
          name="userName"
          rules={[{ required: true, message: '이름을 입력해주세요.' }]}
        >
          <Input allowClear />
        </Form.Item>

        <EmailValidation />

        <Email form={form} messageApi={messageApi} />

        <PasswordValidation />

        <Form.Item
          hasFeedback
          label="연락처 (ex. 01012345678)"
          name="phoneNumber"
          rules={[{ required: true, message: '연락처를 입력해주세요.' }]}
        >
          <Input
            style={{ width: '100%' }}
            placeholder="하이픈(-)없이 01012345678"
            allowClear
          />
        </Form.Item>

        <div
          style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'space-between',
          }}
        >
          <SelectPosition />

          <ProfileImg />
        </div>

        <ButtonGroup
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}
        >
          <Button
            size="large"
            style={{
              width: '100%',
              height: 60,
              border: 'none',
              borderRadius: '0px 0px 0px 8px',
              borderTop: '1px solid #eee',
            }}
            onClick={goHomeAndResetForm}
          >
            홈으로
          </Button>
          <Button
            size="large"
            style={{
              width: '100%',
              height: 60,
              borderRadius: '0px 0px 8px 0px',
            }}
            type="primary"
            htmlType="submit"
            disabled={isSigningUp}
            loading={isSigningUp}
          >
            회원가입
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
}
