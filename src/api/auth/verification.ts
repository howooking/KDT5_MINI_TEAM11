import { customAxios } from '@/api/customAxios';

export const verificationEmail = async (userEmail: string) => {
  // 추후에 변경 /v1/auth/send-email
  const response = await customAxios.post('/v1/auth/send-email', userEmail, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
};
