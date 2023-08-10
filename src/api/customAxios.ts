import { BASE_API_URL } from '@/data/constants';
import {
  deleteAccessTokenFromCookie,
  getAccessTokenFromCookie,
  setAccessTokenToCookie,
} from '@/utils/cookies';
import axios from 'axios';
import getPayloadFromJWT from '@/utils/getPayloadFromJWT';

export const customAxios = axios.create({
  baseURL: BASE_API_URL,
  timeout: 7000, // 5초간 아무 응답이 없으면 취소
});

customAxios.interceptors.request.use(
  async (req) => {
    const accessToken = getAccessTokenFromCookie();
    // accessToken이 없는 경우 === 로그아웃을 한 상태에서하는 요청들 : 회원가입, 이메일중복체크, 로그인), 그런데 있어도 되는듯
    if (!accessToken) {
      return req;
    }

    // 로그인 요청, 회원가입 등... 을 제외한 모든 요청은 accessToken을 필요로함
    req.headers.Authorization = `Bearer ${accessToken}`;
    req.withCredentials = true;

    // // 만료시간 표시
    // access토큰의 만료시간을 초로 나타낸 시간
    const expirationTime = getPayloadFromJWT(accessToken).exp as number;
    // 현재시간을 초로 나타냄
    const currentTime = Math.floor(new Date().getTime() / 1000);
    // 만료시간 > 5분 남은 경우
    const expirationLeft = expirationTime - currentTime;
    console.log(`만료 ${Math.floor(expirationLeft / 60)}분 남았습니다.`);

    return req;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 여러개의 요청이 밀렸을 경우 리프레시토큰 api가 여러번 실행되는 것을 막음
let isRefreshing = false;

// 만료된 토큰으로 인해 pending상태가 된 기존의 요청들을 배열에 담음, 새로운 토큰이 발행되면 이들 요청을 진행
// eslint-disable-next-line no-unused-vars
let refreshSubscribers: ((accessToken: string) => void)[] = [];

customAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response?.data.error.status;

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await axios(`${BASE_API_URL}/v1/auth/refresh-token`);

          if (response.status === 200) {
            setAccessTokenToCookie(response.data.response.accessToken);

            const config = error.config;
            config.headers.Authorization = `Bearer ${response.data.response.accessToken}`;

            const retryOriginalRequest = new Promise((resolve) => {
              resolve(axios(config));
            });

            isRefreshing = false;

            refreshSubscribers.forEach((callback) =>
              callback(response.data.response.accessToken),
            );
            refreshSubscribers = [];

            return retryOriginalRequest;
          }
        } catch (error) {
          deleteAccessTokenFromCookie();
          isRefreshing = false;
          return Promise.reject(error);
        }
      } else {
        return new Promise((resolve) => {
          refreshSubscribers.push((accessToken: string) => {
            error.config.headers.Authorization = `Bearer ${accessToken}`;
            resolve(axios(error.config));
          });
        });
      }
    } else {
      return Promise.reject(error);
    }
  },
);
