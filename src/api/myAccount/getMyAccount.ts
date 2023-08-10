import { customAxios } from '@/api/customAxios';

export const getMyAccount = async () => {
  const response = await customAxios('/v1/user/info');

  return response;
};
