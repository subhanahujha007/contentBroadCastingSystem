import { getScheduleState } from './utils/date';

test('derives active schedule state for current broadcasts', () => {
  const item = {
    startTime: new Date(Date.now() - 60000).toISOString(),
    endTime: new Date(Date.now() + 60000).toISOString(),
  };

  expect(getScheduleState(item)).toBe('active');
});
