import { useEffect, useState } from 'react';
import { Form, Button, message, Tooltip, Spin, Space } from 'antd';
import { SignupFormProps } from '../signupForm';
import { verificationEmail } from '@/api/auth/verification';
import EmailChecked from './emailChecked';
import EmailVerification from './emailVerification';
import EmailAuth from './emailAuth';
import {
  IsLoadingAtom,
  IsEmailCheckAtom,
  ResendAtom,
  TimerAtom,
  EmailVerifiedAtom,
  VerificationAtom,
} from '@/recoil/EmailRecoil';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AxiosResponse } from 'axios';
import { RedoOutlined, LoadingOutlined } from '@ant-design/icons';

export interface EmailProps extends SignupFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
}

export interface EmailVerificationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleVerificationEmail: () => Promise<AxiosResponse<any, any> | null>;
}

export default function Email({ form, messageApi }: EmailProps) {
  // 이메일 중복 체크
  const [isEmailCehck, setIsEmailCheck] = useRecoilState(IsEmailCheckAtom);
  // 이메일 인증 번호 재발송 ui
  const setReSend = useSetRecoilState(ResendAtom);
  // 이메일 인증 과정 로딩 (중복체크, 인증번호 발송, 인증확인)
  const [isLoading, setIsLoading] = useRecoilState(IsLoadingAtom);
  // 이메일 인증번호 확인
  const [emailVerified, setEmailVerified] = useRecoilState(EmailVerifiedAtom);
  // 이메일 인증 번호 발송
  const [verification, setVerification] = useRecoilState(VerificationAtom);
  // 이메일 인증 번호 발송 후에 제출 가능 타이머
  const [timer, setTimer] = useRecoilState(TimerAtom);

  const [reLoading, setReLoading] = useState(false);

  // 이메일 인증번호 발송
  const handleVerificationEmail = async () => {
    setIsLoading(true);
    try {
      const values = await form.validateFields(['userEmail']);
      const userEmail = values.userEmail;
      const response = await verificationEmail(userEmail);

      if (response.status === 200) {
        message.success('인증번호를 발송했습니다.');
        // 인증번호 발생이 정상적으로 이루어졌으면 타이머가 180으로 상태값 변경
        setTimer(180);
      } else {
        message.warning('이메일을 다시 확인해주세요.');
      }
      return response;
    } catch (error) {
      message.error('인증번호 발송에 오류가 발생했습니다.');
      return null;
    } finally {
      setIsLoading(false);
      setVerification(true);
    }
  };

  // 타이머 변경에 따른 리렌더링이 일어나게
  useEffect(() => {
    // side effect를 멈추기 위해서 exactTimer라는 변수를 선언
    let exactTimer: string | number | NodeJS.Timeout | undefined;
    // 타이머가 0보다 크면 timer의 상태값이 초당 -1씩 줄어들고
    // timer가 0초이고 verification state값이 true일 때,
    // reSend state값이 true가 되어서 재발송 버튼을 클릭 할 수 있다.
    if (timer > 0) {
      exactTimer = setTimeout(
        () => setTimer((prevTimer) => prevTimer - 1),
        1000,
      );
    } else if (timer === 0 && verification) {
      setReSend(true);
    }
    // 위의 동작들이 실행되면 타이머가 멈춘다.
    return () => {
      if (exactTimer) {
        clearTimeout(exactTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, verification]);

  // 이메일 인증을 다시 처음부터 하게 하는 재인증 기능
  const handleReAuthentication = () => {
    if (isLoading) return;
    setReLoading(true);

    setTimeout(() => {
      setIsEmailCheck(false);
      setVerification(false);
      setEmailVerified(false);
      setReSend(false);
      setReLoading(false);
    }, 500);
  };

  return (
    <>
      <Form.Item
        hasFeedback
        name="emailAuth"
        rules={[
          {
            required: true,
            validator: (_, value) => {
              if (!value) {
                return Promise.reject('필수 진행 항목입니다.');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        {isEmailCehck ? (
          verification ? (
            emailVerified ? (
              // 인증에 성공한 경우 - 재인증 버튼 표시
              <div>
                <Button type="primary" onClick={handleReAuthentication}>
                  재인증
                </Button>
              </div>
            ) : (
              // 인증 번호 입력 창과 제출 버튼
              <div>
                <Space>
                  <EmailAuth
                    form={form}
                    handleVerificationEmail={handleVerificationEmail}
                  />
                  {reLoading ? (
                    <Spin indicator={<LoadingOutlined spin />} />
                  ) : (
                    <Tooltip title={'이메일 중복 체크로 돌아갑니다.'}>
                      <RedoOutlined
                        onClick={handleReAuthentication}
                        style={{
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          opacity: isLoading ? 0.5 : 1,
                        }}
                      />
                    </Tooltip>
                  )}
                </Space>
                <div>남은 시간: {timer}초</div>
              </div>
            )
          ) : (
            <Space>
              <EmailVerification
                handleVerificationEmail={handleVerificationEmail}
                reLoading={reLoading}
              />
              {reLoading ? (
                <Spin indicator={<LoadingOutlined spin />} />
              ) : (
                <Tooltip title={'이메일 중복 체크로 돌아갑니다.'}>
                  <RedoOutlined
                    onClick={handleReAuthentication}
                    style={{
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.5 : 1,
                    }}
                  />
                </Tooltip>
              )}
            </Space>
          )
        ) : (
          <EmailChecked messageApi={messageApi} form={form} />
        )}
      </Form.Item>
    </>
  );
}
