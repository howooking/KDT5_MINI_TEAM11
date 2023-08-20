import { useState, useRef, Dispatch } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Switch,
  Button,
  Space,
  Typography,
  Tooltip,
  Checkbox,
  message,
  Spin,
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ScheduleItem } from './home';
import { DUTY_ANNUAL } from '@/data/constants';

interface propsType {
  mySchedule: ScheduleItem[];
  events: ScheduleItem[];
  year: number;
  setYear: Dispatch<React.SetStateAction<number>>;
  usersYearlySchedulesLoading: boolean;
}

export default function Calendar({
  mySchedule,
  year,
  setYear,
  events,
  usersYearlySchedulesLoading,
}: propsType) {
  // 데이터로 받아올 events를 상태관리
  // eslint-disable-next-line react-hooks/rules-of-hooks

  // 달력의 현재 월 상태관리
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  // switch 체크 상태관리
  const [isAllChecked, setIsAllChecked] = useState(true);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const calendarRef = useRef<FullCalendar | null>(null);

  const { Title } = Typography;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateSet = (info: any) => {
    const date = info.view.currentStart;
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  };

  const goPrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
  };

  const goNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
  };

  const goToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
  };

  const options = [
    { label: '연차', value: 'ANNUAL' },
    { label: '당직', value: 'DUTY' },
  ];

  const [messageApi, contextHolder] = message.useMessage();
  const [checkedBox, setCheckedBox] = useState(['ANNUAL', 'DUTY']);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCheckboxChange = (check: any) => {
    if (check.length === 0) {
      messageApi.open({
        type: 'error',
        content: '최소한 하나의 옵션은 선택되어야 합니다.',
      });
      return;
    }
    setCheckedBox(check);
  };

  const getFilteredEvents = () => {
    // 현재 보여줄 이벤트를 선택
    // 전체 일정인지, 나만의 일정인지
    const currentEvents = isAllChecked ? events : mySchedule;

    // checkedBox의 상태에 따라 이벤트를 필터링
    return currentEvents.filter((event) => {
      if (checkedBox.includes('ANNUAL') && checkedBox.includes('DUTY')) {
        return true; // 연차와 당직 모두 선택된 경우 모든 이벤트를 반환
      } else if (checkedBox.includes('ANNUAL')) {
        return event.color === DUTY_ANNUAL.ANNUAL.color;
      } else if (checkedBox.includes('DUTY')) {
        return event.color === DUTY_ANNUAL.DUTY.color;
      }
      return false;
    });
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          padding: '0 20px',
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          height: '60px',
        }}
      >
        <div style={{ flex: 1 }}>
          <Tooltip title="모든 일정 또는 나의 일정 확인 가능">
            <Switch
              style={{ marginRight: 10 }}
              checkedChildren="All"
              unCheckedChildren="My"
              defaultChecked
              checked={isAllChecked}
              onChange={(check) => setIsAllChecked(check)}
              loading={usersYearlySchedulesLoading}
            />
          </Tooltip>

          <Checkbox.Group
            options={options}
            value={checkedBox}
            onChange={handleCheckboxChange}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <Space>
            <Button onClick={goPrev} shape="circle">
              <LeftOutlined />
            </Button>
            <Tooltip title="오늘로 이동하려면 클릭하세요.">
              <Title
                level={5}
                style={{
                  width: 150,
                  margin: '0 auto',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onClick={goToday}
              >
                {year}년 {month}월
              </Title>
            </Tooltip>
            <Button onClick={goNext} shape="circle">
              <RightOutlined />
            </Button>
          </Space>
        </div>
        <div style={{ flex: 1 }}></div>
      </div>
      <div style={{ padding: '0 20px 20px 20px' }}>
        {usersYearlySchedulesLoading ? (
          <Spin
            size="large"
            style={{
              position: 'absolute',
              zIndex: 20,
              top: '50%',
              left: 'calc(50% + 120px)',
            }}
          />
        ) : (
          <></>
        )}
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dayMaxEvents={true}
          events={getFilteredEvents()} // 연차 당직 달력에 표시
          height={'calc(100vh - 140px)'}
          datesSet={handleDateSet}
          locale={'ko'} // 지역
          dayCellContent={(args) => args.date.getDate()}
          ref={calendarRef}
          headerToolbar={false}
        />
      </div>
    </>
  );
}
