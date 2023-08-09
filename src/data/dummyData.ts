interface DataType {
  key: number;
  id: number;
  profileThumbUrl: string;
  userName: string;
  position: 'LEVEL1' | 'LEVEL2' | 'LEVEL3' | 'LEVEL4';
  createAt: string;
}

export const DUMMY_WORKERS: DataType[] = [
  {
    key: 1,
    id: 1,
    userName: 'Kim',
    profileThumbUrl: 'imageurl',
    position: 'LEVEL1',
    createAt: '2021-08-03',
  },
  {
    id: 2,
    key: 2,
    userName: 'lee',
    profileThumbUrl: 'imageurl',
    position: 'LEVEL2',
    createAt: '2021-08-03',
  },
  {
    id: 3,
    key: 3,
    userName: 'park',
    profileThumbUrl: 'imageurl',
    position: 'LEVEL3',
    createAt: '2021-08-03',
  },
];

export const DUMMY_MY_SCHEDULES = [
  {
    scheduleType: 'ANNUAL',
    state: 'REJECT',
    startDate: '2023-08-01',
    endDate: '2023-08-05',
  },

  {
    scheduleType: 'ANNUAL',
    state: 'PENDING',
    startDate: '2023-08-03',
    endDate: '2023-08-05',
  },

  {
    scheduleType: 'DUTY',
    state: 'APPROVE',
    startDate: '2023-08-01',
    endDate: '2023-08-01',
  },
];
