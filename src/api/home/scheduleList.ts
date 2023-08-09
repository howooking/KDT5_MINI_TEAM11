import { customAxios } from '@/api/customAxios';

export const scheduleList = async (year: number) => {
  const response = await customAxios(`/v1/schedule/list?year=${year}`);
  return response;
};
