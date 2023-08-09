import { customAxios } from '@/api/customAxios';

export const verificationEmail = async (userEmail: string) => {
  const response = await customAxios.post('/v1/auth/sendEmail', userEmail);
  return response;
};
