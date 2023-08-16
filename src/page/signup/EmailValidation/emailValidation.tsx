import { EMAIL_REGEX } from '@/data/constants';
import { Form, Input } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useCallback } from 'react';

export default function EmailValidation() {
  // 이메일 유효성 검사
  const validateEmail = useCallback((_: RuleObject, value: string) => {
    if (!value || EMAIL_REGEX.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('올바른 형식의 메일을 입력해주세요.'));
  }, []);

  return (
    <>
      <Form.Item
        hasFeedback
        label="이메일"
        name="userEmail"
        rules={[
          { required: true, message: '이메일을 입력해주세요.' },
          { validator: validateEmail },
        ]}
      >
        <Input placeholder="ex) anyone123@email.com" allowClear />
      </Form.Item>
    </>
  );
}
