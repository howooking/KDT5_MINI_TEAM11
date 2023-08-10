import RequesTag from '@/components/RequesTag';
import { DUTY_ANNUAL } from '@/data/constants';
import { AccessTokenAtom } from '@/recoil/AccessTokkenAtom';
import { Select, Button, Table, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ReRenderStateAtom } from '@/recoil/ReRenderStateAtom';
import dayjs from 'dayjs';
import {
  cancelScheduleRequest,
  getMySchedule,
} from '@/api/myAccount/mySchedule';

interface CheckedVacationRequestType {
  key: number;
  id: number;
  scheduleType: 'ANNUAL' | 'DUTY';
  startDate: string;
  endDate: string;
  state: 'PENDING' | 'APPROVE' | 'REJECT';
}

export default function Vaction() {
  // antd message(화면 상단에 뜨는 메세지)기능
  const [messageApi, contextHolder] = message.useMessage();

  const [checkedVacationRequests, setCheckedVacationRequests] = useState<
    CheckedVacationRequestType[]
  >([]);

  const [isvacationRequestsLoading, setIsvacationRequestsLoading] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);

  const accessToken = useRecoilValue(AccessTokenAtom);

  const setReRender = useSetRecoilState(ReRenderStateAtom);

  const { Option } = Select;

  const fetchData = async () => {
    if (!accessToken) {
      return;
    }
    try {
      const response = await getMySchedule(year);
      if (response.status === 200) {
        const CheckedVacationRequestsData = response.data
          .response as CheckedVacationRequestType[];
        // 성공했을때
        setCheckedVacationRequests(
          CheckedVacationRequestsData.map((el) => {
            return { ...el, key: el.id };
          }),
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('연가/당직 데이터를 불러오지 못했습니다. : ', error);
    } finally {
      setIsvacationRequestsLoading(false);
    }
  };

  useEffect(() => {
    setIsvacationRequestsLoading(true);
    fetchData();
  }, [accessToken, year]);

  const handleCancelSchedule = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await cancelScheduleRequest(id);
      if (response.status === 200) {
        // 삭제가 성공하면 데이터 다시 불러오기
        fetchData();
        messageApi.open({
          type: 'success',
          content: '삭제되었습니다.',
        });
        setReRender((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: '요청 실패',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pastDates = (current: dayjs.Dayjs) => {
    return current < dayjs().startOf('day');
  };

  const columns: ColumnsType<CheckedVacationRequestType> = [
    {
      title: '연차/당직',
      dataIndex: 'scheduleType',
      key: 'scheduleType',
      align: 'center',
      render: (_, { scheduleType }) => (
        <span
          style={{ color: DUTY_ANNUAL[scheduleType].color, fontWeight: 700 }}
        >
          {DUTY_ANNUAL[scheduleType].label}
        </span>
      ),
      filters: [
        {
          text: '연차',
          value: 'ANNUAL',
        },
        {
          text: '당직',
          value: 'DUTY',
        },
      ],
      onFilter: (value: string | number | boolean, record) =>
        record.scheduleType.includes(value as string),
    },
    {
      title: '시작일',
      dataIndex: 'startDate',
      key: 'startDate',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: (a, b) =>
        Number(a.startDate.replaceAll('-', '')) -
        Number(b.startDate.replaceAll('-', '')),
    },

    {
      title: '종료일',
      dataIndex: 'endDate',
      key: 'endDate',
      align: 'center',
      sorter: (a, b) =>
        Number(a.endDate.replaceAll('-', '')) -
        Number(b.endDate.replaceAll('-', '')),
    },

    {
      title: '승인여부',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { state }) => <RequesTag state={state} />,
      filters: [
        {
          text: '심사중',
          value: 'PENDING',
        },
        {
          text: '승인',
          value: 'RESOLVE',
        },
        {
          text: '거절',
          value: 'REJECT',
        },
      ],
      onFilter: (value: string | number | boolean, record) =>
        record.state.includes(value as string),
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, { id, endDate, state }) => (
        <Popconfirm
          title="목록 삭제"
          description="삭제하시겠습니까?"
          onConfirm={() => handleCancelSchedule(id)}
          okText="Yes"
          cancelText="No"
          disabled={pastDates(dayjs(endDate)) || state === 'REJECT'}
        >
          <Button
            size="small"
            disabled={
              isLoading || pastDates(dayjs(endDate)) || state === 'REJECT'
            }
            danger
          >
            삭제
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const selectedYearsOptions = [];
  for (let i = 0; i <= 5; i++) {
    const year = currentYear - i;
    selectedYearsOptions.push(
      <Option key={year} value={year}>
        {year}년
      </Option>,
    );
  }

  return (
    <>
      {contextHolder}
      <Select
        style={{ width: 100, padding: 5 }}
        defaultValue={currentYear}
        value={year}
        onChange={(value) => setYear(value)}
      >
        {selectedYearsOptions}
      </Select>
      <Table
        size="small"
        columns={columns}
        dataSource={checkedVacationRequests}
        loading={isvacationRequestsLoading}
        pagination={{ style: { marginRight: 20 }, defaultPageSize: 15 }}
      />
    </>
  );
}
