import { customAxios } from '@/api/customAxios';

export const getVacationRequests = async () => {
  const response = await customAxios.get('/v1/admin/list', {});
  return response;
};

export const approveRejectPending = async (
  id: number,
  type: 'APPROVE' | 'REJECT' | 'PENDING',
) => {
  const response = await customAxios.post(`/v1/admin/${type.toLowerCase()}`, {
    id,
  });
  return response;
};

export const getWorkers = async () => {
  const response = await customAxios.get('/v1/admin/worker-list', {});
  return response;
};

export const changePosition = async (
  id: number,
  position: 'LEVEL1' | 'LEVEL2' | 'LEVEL3' | 'LEVEL4',
) => {
  const response = await customAxios.post(`/v1/admin/change-position`, {
    id,
    position,
  });
  return response;
};
