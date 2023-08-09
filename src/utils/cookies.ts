export const deleteAccessTokenFromCookie = () => {
  const date = new Date();
  // 쿠키는 따로 삭제 방법이 있지 않고 만료시간을 현재로 줘서 자동적으로 삭제되게
  const expires = 'expires=' + date.toUTCString();
  const cookieString = `accessToken=; ${expires}; path=/`;
  document.cookie = cookieString;
};

export const getAccessTokenFromCookie = () => {
  // 쿠키에 accessToken 있으면 가져오고 없으면 null
  const cookie = document.cookie
    .split('; ')
    .find((cookie) => cookie.split('=')[0] === 'accessToken');
  return cookie ? cookie.split('=')[1] : null;
};

export const setAccessTokenToCookie = (accessToken: string) => {
  const date = new Date();

  // 30분 추가
  date.setTime(date.getTime() + 30 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();

  // 쿠키에 accessToke, 만료시간, path지정
  const cookieString = `accessToken=${accessToken}; ${expires}; path=/`;
  document.cookie = cookieString;
};
