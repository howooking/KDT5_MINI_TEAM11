import { customAxios } from '@/api/customAxios';

export const changeMyInfo = async (data: {
  userPassword?: string;
  phoneNumber?: string;
  profileThumbUrl?: string;
}) => {
  const response = await customAxios.patch('/v1/user/info', data, {});
  return response;
};
