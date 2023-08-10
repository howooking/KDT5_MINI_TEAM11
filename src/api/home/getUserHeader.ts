import { customAxios } from '@/api/customAxios';

export const getUserHeader = async () => {
  const response = await customAxios('/v1/user/userHeader');
  return response;
};
