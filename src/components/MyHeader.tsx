import { signout } from '@/api/auth/signout';
import { AccessTokenAtom } from '@/recoil/AccessTokkenAtom';
import { Button, Skeleton, Space, message, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import UserInfo from '@/components/UserInfo';
import { deleteAccessTokenFromCookie } from '@/utils/cookies';
import { IsManagerAtom } from '@/recoil/IsManagerAtom';
import { getUserHeader } from '@/api/home/getUserHeader';
import { ReRenderStateAtom } from '@/recoil/ReRenderStateAtom';
import { UserEmailAtom } from '@/recoil/UserEmailAtom';

export default function MyHeader() {
  // antd theme
  const {
    token: { colorPrimaryBg },
  } = theme.useToken();

  // antd message(화면 상단에 뜨는 메세지)기능
  const [messageApi, contextHolder] = message.useMessage();

  // 리코일 전역 access토큰
  const [accessToken, setAccessToken] = useRecoilState(AccessTokenAtom);

  const reRender = useRecoilValue(ReRenderStateAtom);

  // **네브바에 있는 유저 정보 GET요청**
  // 네브바에 표시될 유저 정보들
  const [userHeaderInfo, setUserHeaderInfo] = useState({
    userName: '',
    profileThumbNail: '',
    position: '',
    usedVacation: '',
  });

  // 매니저여부, 사용자 이메일 set하는 함수
  const setIsManager = useSetRecoilState(IsManagerAtom);
  const setUserEmail = useSetRecoilState(UserEmailAtom);

  // 통신 loading
  const [isMyHeaderLoading, setIsMyHeaderLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      if (!accessToken) {
        return;
      }
      try {
        setIsMyHeaderLoading(true);
        const response = await getUserHeader();
        if (response.status === 200) {
          const userData = response.data.response;
          setUserHeaderInfo({
            profileThumbNail: userData.profileThumbNail,
            usedVacation: userData.usedVacation.toString(),
            userName: userData.userName,
            position: userData.position,
          });
          // 헤더정보는 항상 노출이 되는 부분이기 때문에 관리자 여부, 사용자 이메일을 여기에서 세팅해줌
          setIsManager(userData.position === 'MANAGER');
          setUserEmail(userData.userEmail);
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log('헤더 유저정보 로딩 중 에러 발생:', error);
      } finally {
        setIsMyHeaderLoading(false);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, reRender]);

  // 로그아웃 통신 로딩 ui
  const [isSigningout, setIsSigningout] = useState(false);

  const handleSignout = async () => {
    try {
      setIsSigningout(true);
      await signout();
    } catch (error) {
      console.log('로그아웃 중 에러발생 : ', error);
    } finally {
      // 로그아웃은 통신이 성공하든 실패하든 상관없이 토큰을 삭제해주면 된다.
      // 그러면 통신을 왜하냐고 물어볼 수 있는데 서버쪽에서 refresh 토큰을 삭제하기 위해서라고 함

      // 쿠키에서 삭제
      deleteAccessTokenFromCookie();

      // recoil 초기화
      setAccessToken(null);

      // 로딩 ui종료
      setIsSigningout(false);

      // 오류가 났다고 하더라도 로그아웃 성공메세지를 보여줌
      messageApi.open({
        type: 'success',
        content: '로그아웃이 완료 되었습니다.', // 서버에서 오는 성공메세지와 동일
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Header
        style={{
          backgroundColor: colorPrimaryBg,
          height: 60,
          borderBottom: '1px solid #eee',
        }}
      >
        <div
          style={{
            height: 60,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Link to="/" style={{ fontSize: 30 }} className="icons">
            🏠
          </Link>
          {accessToken ? (
            <Space size="large">
              {isMyHeaderLoading ? (
                <div
                  style={{
                    margin: 'auto',
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <Skeleton.Avatar
                    active
                    size={32}
                    shape="circle"
                    style={{ display: 'block' }}
                  />
                  <Skeleton.Input
                    active
                    style={{ width: 200, display: 'block' }}
                  />
                </div>
              ) : (
                <UserInfo userHeaderInfo={userHeaderInfo} />
              )}

              <Button
                type="primary"
                danger
                onClick={handleSignout}
                loading={isSigningout}
                disabled={isSigningout}
              >
                로그아웃
              </Button>
            </Space>
          ) : (
            <></>
          )}
        </div>
      </Header>
    </>
  );
}
