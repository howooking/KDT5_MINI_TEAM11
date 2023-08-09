import { BASE_API_URL } from '@/data/constants';
import {
  deleteAccessTokenFromCookie,
  setAccessTokenToCookie,
} from '@/utils/cookies';
import axios from 'axios';

export default async function refreshAccessToken() {
  try {
    const response = await axios(`${BASE_API_URL}/v1/auth/refresh-token`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      setAccessTokenToCookie(response.data.response.accessToken);
      return response.data.response.accessToken;
    }
  } catch (error) {
    deleteAccessTokenFromCookie();
    throw error;
  }
}
