import { customAxios } from '@/api/customAxios';

export const signout = async () => {
  const response = await customAxios.post('/v1/auth/signout');
  return response;
};
