import { customAxios } from '@/api/customAxios';

interface valuseType {
  confirm_password: string;
  phone: string;
  position: string;
  profileThumbUrl: string;
  userEmail: string;
  userPassword: string;
  userName: string;
}

export const signup = async (values: valuseType) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirm_password, ...otherData } = values;

  const response = await customAxios.post('/v1/auth/signup', otherData, {
    withCredentials: true,
  });
  return response;
};
