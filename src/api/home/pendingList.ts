import { customAxios } from '@/api/customAxios';

export const pendingList = async (year: number) => {
  const response = await customAxios(
    `/v1/user/schedule/pending-list?year=${year}`,
  );
  return response;
};
