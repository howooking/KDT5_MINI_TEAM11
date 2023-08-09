export const BASE_API_URL = 'https://prettyawesome.duckdns.org:8080/api';

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[!@#$%^&*()-+=])(?=.*[a-zA-Z]).{8,16}$/;

export const POSITIONS: {
  [key: string]: { label: string; total_vacation: number; color: string };
} = {
  LEVEL1: {
    label: '레벨1',
    total_vacation: 15,
    color: 'lime',
  },
  LEVEL2: {
    label: '레벨2',
    total_vacation: 18,
    color: 'geekblue',
  },
  LEVEL3: {
    label: '레벨3',
    total_vacation: 21,
    color: 'magenta',
  },
  LEVEL4: {
    label: '레벨4',
    total_vacation: 24,
    color: 'volcano',
  },
  MANAGER: {
    label: '매니저',
    total_vacation: 27,
    color: 'gold',
  },
};

export const REQUEST_STATE = {
  PENDING: { label: '심사중', color: '#f2cf50' },
  APPROVE: { label: '승인', color: '#50dcf2' },
  REJECT: { label: '거절', color: '#f26650' },
};
export const DUTY_ANNUAL: {
  [key: string]: { label: string; color: string };
} = {
  DUTY: { label: '당직', color: '#f08080' },
  ANNUAL: { label: '연차', color: '#b1aee5' },
};
