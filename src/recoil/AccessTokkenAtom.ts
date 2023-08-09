import { getAccessTokenFromCookie } from '@/utils/cookies';
import { atom } from 'recoil';

export const AccessTokenAtom = atom({
  key: 'AccessToken',
  default: getAccessTokenFromCookie(),
});
