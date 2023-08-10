import { AccessTokenAtom } from '@/recoil/AccessTokkenAtom';
import {
  DatePicker,
  Layout,
  Modal,
  Button,
  Select,
  Space,
  message,
} from 'antd';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Calendar from './calendar';
import Signin from '@/page/home/signin';
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import MySchedule from '@/page/home/mySchedule';
import { DUTY_ANNUAL } from '@/data/constants';
import { ReRenderStateAtom } from '@/recoil/ReRenderStateAtom';
import { scheduleList } from '@/api/home/scheduleList';
import { UserEmailAtom } from '@/recoil/UserEmailAtom';
import { addScheduleRequest } from '@/api/myAccount/mySchedule';

const { RangePicker } = DatePicker;

export interface ScheduleItem {
  userEmail: string;
  userName: string;
  scheduleType: string;
  startDate: string;
  endDate: string;
  state: string;
}

interface mySchedule extends ScheduleItem {
  id: number;
}

export default function Home() {
  // antd message(화면 상단에 뜨는 메세지)기능

  const [messageApi, contextHolder] = message.useMessage();

  const [toggleRequest, setToggleRequest] = useState(false);
  console.log(toggleRequest);

  const [year, setYear] = useState(new Date().getFullYear());
  // const {
  //   token: { colorTextLabel },
  // } = theme.useToken();

  const accessToken = useRecoilValue(AccessTokenAtom);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(!accessToken);
  const setReRender = useSetRecoilState(ReRenderStateAtom);
  // 로그아웃을 하면 isModalOpen이 !accessToken의 상태를 바로 반영하지 않음
  // 따라서 useEffect로 반영이 되도록함
  useEffect(() => {
    setIsModalOpen(!accessToken);
  }, [accessToken]);

  const [scheduleInput, setScheduleInput] = useState<{
    scheduleType: string;
    startDate: string;
    endDate: string;
  }>({
    scheduleType: '',
    startDate: '',
    endDate: '',
  });

  const userEmail = useRecoilValue(UserEmailAtom);

  const [events, setEvents] = useState<ScheduleItem[]>([]);

  const [sideMySchedule, setSideMyschedule] = useState<
    {
      id: number;
      key: number;
      scheduleType: 'ANNUAL' | 'DUTY';
      startDate: string;
      endDate: string;
      state: 'REJECT' | 'APPROVE' | 'PENDING';
    }[]
  >([]);

  const [userYearlySchedulesLoading, setUserYearlySchedulesLoading] =
    useState(false);

  useEffect(() => {
    const getUsersYearlySchedules = async () => {
      if (!accessToken) {
        return;
      }
      try {
        setUserYearlySchedulesLoading(true);
        const listResponse = await scheduleList(year);
        const listResponseData = listResponse.data.response;

        const sideMyScheduleData = listResponseData
          .filter((item: mySchedule) => item.userEmail === userEmail)
          .map((item: mySchedule) => {
            return {
              id: item.id,
              key: item.id,
              scheduleType: item.scheduleType,
              startDate: item.startDate,
              endDate: item.endDate,
              state: item.state,
            };
          });
        setSideMyschedule(sideMyScheduleData);

        const events = listResponseData.map((item: ScheduleItem) => {
          const adjustEndDate = dayjs(item.endDate)
            .add(1, 'day')
            .format('YYYY-MM-DD');
          return {
            userEmail: item.userEmail,
            title: item.userName,
            start: item.startDate,
            end: adjustEndDate,
            color: DUTY_ANNUAL[item.scheduleType].color,
          };
        });
        setEvents(events);
      } catch (error) {
        console.log(error);
      } finally {
        setUserYearlySchedulesLoading(false);
      }
    };
    getUsersYearlySchedules();
  }, [year, accessToken, userEmail]);

  const handleSelect = (value: string) => {
    setScheduleInput({
      startDate: '',
      endDate: '',
      scheduleType: value,
    });
  };

  const handleRangePicker = (value: RangePickerProps['value']) => {
    const startDate = value && value[0];
    const endDate = value && value[1];
    setScheduleInput((prev) => ({
      ...prev,
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
    }));
  };

  const handleDatePicker = (value: DatePickerProps['value']) => {
    const startDate = dayjs(value).format('YYYY-MM-DD');
    setScheduleInput((prev) => ({
      ...prev,
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(startDate).format('YYYY-MM-DD'),
    }));
  };

  const [isAddingRequest, setIsAddingRequest] = useState(false);

  const handleSubmitSchedule = async () => {
    if (!accessToken) {
      return;
    }
    try {
      setIsAddingRequest(true);
      const response = await addScheduleRequest(scheduleInput);
      if (response.status === 200) {
        messageApi.open({
          type: 'success',
          content: `${
            DUTY_ANNUAL[
              response.data.response.scheduleType as 'ANNUAL' | 'DUTY'
            ]?.label
          } 신청 완료`,
        });
        setToggleRequest((prev) => !prev);
        setReRender((prev) => !prev);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content:
          error.response?.data.error.message ||
          '연차, 당직 신청 등록 중 오류가 발생하였습니다.',
      });
    } finally {
      setIsAddingRequest(false);
    }
  };

  const pastDates = (current: dayjs.Dayjs) => {
    return current < dayjs().startOf('day');
  };
  const mySchedule = events.filter((event) => event.userEmail === userEmail);

  return (
    <>
      {contextHolder}

      {/* 로그인 창 */}
      <Modal
        title="로그인"
        centered
        closeIcon={false}
        footer={null}
        open={isModalOpen}
      >
        <Signin setIsModalOpen={setIsModalOpen} />
      </Modal>

      <Layout
        style={{
          filter: accessToken ? '' : 'blur(5px)',
          userSelect: 'none',
          height: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Sider
          width={300}
          style={{
            background: 'white',
            paddingTop: 20,
          }}
          className="booh"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <div style={{ width: '100%' }}>
              {/* <MySchedule
                isPending
                setToggleRequest={setToggleRequest}
                schedule={myPendingSchedule}
                loading={isMyScheduleLoading}
                caption="요청대기"
              /> */}
            </div>
            <div style={{ width: '100%' }}>
              <MySchedule
                setToggleRequest={setToggleRequest}
                schedule={sideMySchedule}
                loading={userYearlySchedulesLoading}
                caption="요청결과"
              />
            </div>
            <Space direction="vertical" style={{ width: '100%', padding: 20 }}>
              <Select
                defaultValue="DEFAULT"
                style={{ width: '100%' }}
                onChange={handleSelect}
                options={[
                  { value: 'DEFAULT', label: '선택' },
                  { value: 'ANNUAL', label: '연차' },
                  { value: 'DUTY', label: '당직' },
                ]}
              />
              {scheduleInput.scheduleType === 'ANNUAL' ? (
                <RangePicker
                  onChange={handleRangePicker}
                  style={{ width: '100%' }}
                  disabled={scheduleInput.scheduleType !== 'ANNUAL'}
                  disabledDate={pastDates}
                />
              ) : (
                <DatePicker
                  onChange={handleDatePicker}
                  style={{ width: '100%' }}
                  disabled={scheduleInput.scheduleType !== 'DUTY'}
                  disabledDate={pastDates}
                />
              )}

              <Button
                type="primary"
                style={{ width: '100%' }}
                onClick={handleSubmitSchedule}
                loading={isAddingRequest}
                disabled={
                  isAddingRequest ||
                  scheduleInput.scheduleType === '' ||
                  scheduleInput.scheduleType === 'DEFAULT' ||
                  scheduleInput.startDate === '' ||
                  scheduleInput.startDate === 'Invalid Date' ||
                  scheduleInput.endDate === '' ||
                  scheduleInput.endDate === 'Invalid Date'
                }
              >
                신청
              </Button>
            </Space>
          </div>
        </Sider>
        <Layout style={{ paddingLeft: 10, flex: 1, height: '100%' }}>
          <Content
            style={{
              background: 'white',
              height: '100%',
              overflow: 'auto',
            }}
          >
            {/* 로그인 상태를 확인하기 위해서 accessToken을 boolean 데이터 형식으로 변환해서 Calendar컴포넌트에 props로 전달 */}
            <Calendar
              mySchedule={mySchedule}
              events={events}
              year={year}
              setYear={setYear}
              userYearlySchedulesLoading={userYearlySchedulesLoading}
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
