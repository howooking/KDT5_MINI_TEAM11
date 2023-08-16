import { PASSWORD_REGEX } from '@/data/constants';
import { Form, Input } from 'antd';
import { RuleObject } from 'antd/es/form';
import { useCallback } from 'react';

export default function PasswordValidation() {
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
        new Error('최소 하나의 숫자와 영어 대소문자가 포함되어야 합니다.'),
      );
    }

    if (!SPECIAL_REGEX.test(value) && !ENGLISH_REGEX.test(value)) {
      return Promise.reject(
        new Error('최소 하나의 특수문자와 영어 대소문자가 포함되어야 합니다.'),
      );
    }

    if (!NUMBER_REGEX.test(value) && !SPECIAL_REGEX.test(value)) {
      return Promise.reject(
        new Error('최소 하나의 숫자와 특수문자가 포함되어야 합니다.'),
      );
    }

    if (!NUMBER_REGEX.test(value)) {
      return Promise.reject(new Error('최소 하나의 숫자가 포함되어야 합니다.'));
    }

    if (!SPECIAL_REGEX.test(value)) {
      return Promise.reject(
        new Error('최소 하나의 특수문자가 포함되어야 합니다.'),
      );
    }

    if (!ENGLISH_REGEX.test(value)) {
      return Promise.reject(
        new Error('최소 하나의 영어 대소문자가 포함되어야 합니다.'),
      );
    }

    if (!PASSWORD_REGEX.test(value)) {
      return Promise.reject(new Error('비밀번호는 8~16자 입니다.'));
    }

    return Promise.resolve();
  }, []);
  return (
    <>
      <Form.Item
        hasFeedback
        label="비밀번호 (영문, 숫자, 특수문자를 포함해주세요.)"
        name="userPassword"
        rules={[{ required: true, validator: validatePassword }]}
      >
        <Input.Password
          placeholder="비밀번호는 8자리 이상 16자리 미만입니다."
          allowClear
        />
      </Form.Item>

      <Form.Item
        label="비밀번호 확인"
        name="confirm_password"
        dependencies={['userPassword']}
        hasFeedback
        rules={[
          { required: true, message: '비밀번호를 입력해주세요' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('userPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
            },
          }),
        ]}
      >
        <Input.Password allowClear />
      </Form.Item>
    </>
  );
}
