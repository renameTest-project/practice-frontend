import { atom, selector } from 'recoil';

export const timerState = atom({
  key: 'timerState', // 고유 id
  default: 0, // 기본(초기)값
});

export const startTimeState = atom({
  key: 'startTimeState',
  default: '',
});

export const getStartTimeState = selector({
  key: 'getStartTimeState',
  get: ({ get }) => {
    const startTime = get(startTimeState);

    return startTime;
  },
});
