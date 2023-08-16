import { atom } from 'recoil';

export const IsEmailCheckAtom = atom({
  key: 'IsEmailCheckAtom',
  default: false,
});

export const IsLoadingAtom = atom({
  key: 'IsLoadingAtom',
  default: false,
});

export const ResendAtom = atom({
  key: 'ResendAtom',
  default: false,
});

export const EmailVerifiedAtom = atom({
  key: 'EmailVerifiedAtom',
  default: false,
});

export const TimerAtom = atom({
  key: 'TimerAtom',
  default: 0,
});

export const VerificationAtom = atom({
  key: 'VerificationAtom ',
  default: false,
});
