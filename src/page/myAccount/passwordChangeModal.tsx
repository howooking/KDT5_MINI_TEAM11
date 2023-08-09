import { changeMyInfo } from '@/api/myAccount/changeMyInfo';
import { PASSWORD_REGEX } from '@/data/constants';
import { AccessTokenAtom } from '@/recoil/AccessTokkenAtom';
import { Button, Form, Input, Modal, Space, message } from 'antd';
import { FormInstance, RuleObject } from 'antd/es/form';
import { useCallback, useRef } from 'react';
import { useRecoilValue } from 'recoil';

interface PasswordChangeModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PasswordChangeModal({
  isModalOpen,
  setIsModalOpen,
}: PasswordChangeModalProps) {
  const formRef = useRef<FormInstance>(null);

  // antd message(화면 상단에 뜨는 메세지)기능
  const [messageApi, contextHolder] = message.useMessage();

  const accessToken = useRecoilValue(AccessTokenAtom);

  // 비밀번호 유효성 검사
  const validatePassword = useCallback((_: RuleObject, value: string) => {
    const NUMBER_REGEX = /\d/;
    const SPECIAL_REGEX = /[!@#$%^&*()-+=]/;
    const ENGLISH_REGEX = /[a-zA-Z]/;
    if (!value) {
      return Promise.reject(new Error('비밀번호를 입력해주세요.'));
    }
    if (!NUMBER_REGEX.test(value) && !ENGLISH_REGEX.test(value)) {
      return Promise.reject(
        new Error(
          '비밀번호에는 최소 하나의 숫자와 영어 대소문자가 포함되어야 합니다.',
        ),
      );
    }
    if (!SPECIAL_REGEX.test(value) && !ENGLISH_REGEX.test(value)) {
      return Promise.reject(
        new Error(
          '비밀번호에는 최소 하나의 특수문자와 영어 대소문자가 포함되어야 합니다.',
        ),
      );
    }
    if (!NUMBER_REGEX.test(value) && !SPECIAL_REGEX.test(value)) {
      return Promise.reject(
        new Error(
          '비밀번호에는 최소 하나의 숫자와 특수문자가 포함되어야 합니다.',
        ),
      );
    }
    if (!NUMBER_REGEX.test(value)) {
      return Promise.reject(
        new Error('비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.'),
      );
    }

    if (!SPECIAL_REGEX.test(value)) {
      return Promise.reject(
        new Error('비밀번호에는 최소 하나의 특수문자가 포함되어야 합니다.'),
      );
    }
    if (!ENGLISH_REGEX.test(value)) {
      return Promise.reject(
        new Error(
          '비밀번호에는 최소 하나의 영어 대소문자가 포함되어야 합니다.',
        ),
      );
    }
    if (!PASSWORD_REGEX.test(value)) {
      return Promise.reject(new Error('비밀번호는 8~16자 입니다.'));
    }
    return Promise.resolve();
  }, []);

  const handleChangePassword = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      if (!accessToken) {
        return;
      }
      const response = await changeMyInfo({
        userPassword: values.newPassword,
      });
      if (response.status === 200) {
        setIsModalOpen(false);
        messageApi.open({
          type: 'success',
          content: '비밀번호를 수정하였습니다.',
        });
      }
      if (formRef.current) {
        formRef.current.resetFields();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      messageApi.open({
        type: 'success',
        content:
          error.response.data.error.message ||
          '사용자 정보 수정에 실패하였습니다.',
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        footer={null}
        centered
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        closeIcon={false}
      >
        <Form
          initialValues={{ newPassword: '', confirmPassword: '' }}
          layout="vertical"
          name="basic"
          wrapperCol={{ span: 30, offset: 0 }}
          onFinish={handleChangePassword}
          autoComplete="off"
          ref={formRef}
        >
          <Space direction="vertical" style={{ display: 'flex' }}>
            <Form.Item
              label="신규 비밀번호 (영문, 숫자, 특수문자를 포함해주세요.)"
              name="newPassword"
              rules={[{ required: true, validator: validatePassword }]}
              hasFeedback
            >
              <Input.Password
                placeholder="비밀번호는 8자리 이상 16자리 미만입니다."
                allowClear
              />
            </Form.Item>
            <Form.Item
              label="신규 비밀번호 재입력"
              name="confirmPassword"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: '비밀번호를 입력해주세요' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('비밀번호가 일치하지 않습니다.'),
                    );
                  },
                }),
              ]}
            >
              <Input.Password allowClear />
            </Form.Item>
          </Space>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ width: '100%' }}
          >
            비밀번호 수정
          </Button>
        </Form>
      </Modal>
    </>
  );
}
