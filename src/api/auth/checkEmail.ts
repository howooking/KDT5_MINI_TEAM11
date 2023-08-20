import { customAxios } from '@/api/customAxios';

export const checkEmail = async (userEmail: string) => {
  // 추후에  /v1/auth/check-email 변경
  const response = await customAxios.post('/v1/auth/check-email', userEmail, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
};

export const checkEmailAuth = async (data: {
  userEmail: string;
  userEmailAuth: string;
}) => {
  const response = await customAxios.post('/v1/auth/check-email-auth', data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
};
