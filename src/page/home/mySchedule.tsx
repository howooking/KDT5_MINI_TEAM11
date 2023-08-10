import RequesTag from '@/components/RequesTag';
import { IMySchedule } from '@/types/IMySchdule';
import { Button, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import { DUTY_ANNUAL } from '@/data/constants';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { ReRenderStateAtom } from '@/recoil/ReRenderStateAtom';
import { cancelScheduleRequest } from '@/api/myAccount/mySchedule';

const { Text } = Typography;

interface MyScheduleProps {
  schedule: IMySchedule[];
  loading: boolean;
  caption: string;
  isPending?: boolean;
  setToggleRequest: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function MySchedule({
  isPending,
  schedule,
  loading,
  caption,
  setToggleRequest,
}: MyScheduleProps) {
  const [isDeletingRequest, setIsDeletingRequest] = useState(false);

  const setReRender = useSetRecoilState(ReRenderStateAtom);

  // antd message(화면 상단에 뜨는 메세지)기능
  const [messageApi, contextHolder] = message.useMessage();

  const handleCancleSchedule = async (key: number) => {
    try {
      setIsDeletingRequest(true);
      const response = await cancelScheduleRequest(key);
      if (response.status === 200) {
        messageApi.open({
          type: 'success',
          content: response.data.response,
        });
        setToggleRequest((prev) => !prev);
        setReRender((prev) => !prev);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error.response?.data.error.message || '취소에 실패하였습니다.',
      });
    } finally {
      setIsDeletingRequest(false);
    }
  };

  const columns: ColumnsType<IMySchedule> = [
    {
      title: (
        <Text type="secondary" style={{ fontSize: 9 }}>
          연/당
        </Text>
      ),
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
    },

    {
      title: (
        <Text type="secondary" style={{ fontSize: 9 }}>
          시작일
        </Text>
      ),
      dataIndex: 'startDate',
      key: 'startDate',
      align: 'center',
      render: (_, { startDate }) => <>{startDate.slice(5, 10)}</>,
    },
    {
      title: (
        <Text type="secondary" style={{ fontSize: 9 }}>
          종료일
        </Text>
      ),
      dataIndex: 'endDate',
      key: 'endDate',
      align: 'center',
      render: (_, { endDate }) => <>{endDate.slice(5, 10)}</>,
    },
    {
      title: (
        <Text type="secondary" style={{ fontSize: 9 }}>
          {isPending ? '요청취소' : '상태'}
        </Text>
      ),
      key: 'state',
      dataIndex: 'state',
      render: (_, { state, key }) => {
        return isPending ? (
          <Button
            disabled={isDeletingRequest}
            size="small"
            style={{ fontSize: 9 }}
            danger
            onClick={() => handleCancleSchedule(key)}
          >
            취소
          </Button>
        ) : (
          <RequesTag state={state} small />
        );
      },
      align: 'center',
    },
  ];
  const sortedData = schedule.sort(
    (a, b) =>
      Number(b.startDate.replaceAll('-', '')) -
      Number(a.startDate.replaceAll('-', '')),
  );
  return (
    <>
      {contextHolder}
      <Table
        caption={caption}
        rowClassName="myScheduleRow"
        pagination={{ defaultPageSize: 5, style: { paddingRight: 10 } }}
        columns={columns}
        dataSource={sortedData}
        size="small"
        loading={loading}
      />
    </>
  );
}
