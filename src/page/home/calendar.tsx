import { useState, useRef, Dispatch } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Switch, Button, Space, Typography, Tooltip, Skeleton } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ScheduleItem } from './home';

interface propsType {
  mySchedule: ScheduleItem[];
  events: ScheduleItem[];
  year: number;
  setYear: Dispatch<React.SetStateAction<number>>;
  userYearlySchedulesLoading: boolean;
}

export default function Calendar({
  mySchedule,
  year,
  setYear,
  events,
  userYearlySchedulesLoading,
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
  const renderDayCellContent = (args: any) => {
    // '일' 문자 제거
    return args.date.getDate();
  };

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

  return (
    <>
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
              loading={userYearlySchedulesLoading}
            />
          </Tooltip>
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
        {userYearlySchedulesLoading ? (
          <Skeleton.Input
            active
            block
            style={{ height: 'calc(100vh - 140px)' }}
          />
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dayMaxEvents={true}
            events={isAllChecked ? events : mySchedule} // 연차 당직 달력에 표시
            height={'calc(100vh - 140px)'}
            datesSet={handleDateSet}
            locale={'ko'} // 지역
            dayCellContent={renderDayCellContent} // '일' 문자 렌더링 변경
            ref={calendarRef}
            headerToolbar={false}
          />
        )}
      </div>
    </>
  );
}
