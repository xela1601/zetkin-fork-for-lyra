import { ZetkinEvent } from 'utils/types/zetkin';
import {
  ACTIVITIES,
  EventActivity,
} from 'features/campaigns/models/CampaignActivitiesModel';
import {
  doArbitraryClustering,
  isEventsOverlaping,
} from './clusterEventsForWeekCalender';

const mockEventData: ZetkinEvent = {
  activity: {
    id: 1,
    title: 'Flyering',
  },
  campaign: {
    id: 1,
    title: 'My campaign',
  },
  cancelled: null,
  contact: null,
  end_time: '1857-07-05T13:37:00.000Z',
  id: 1,
  info_text: '',
  location: {
    id: 1,
    lat: 0,
    lng: 0,
    title: 'Dorfplatz',
  },
  num_participants_available: 0,
  num_participants_required: 0,
  organization: {
    id: 1,
    title: 'KPD',
  },
  published: null,
  start_time: '1857-07-05T13:37:00.000Z',
};

function mockEvent(id: number, data: Partial<ZetkinEvent>): EventActivity {
  return {
    data: {
      ...mockEventData,
      ...data,
      id,
    },
    endDate: null,
    kind: ACTIVITIES.EVENT,
    startDate: null,
  };
}

describe('doArbitraryClustering()', () => {
  it('should not cluster if less then 4 events', () => {
    const result = doArbitraryClustering([
      mockEvent(1, {
        activity: {
          id: 5,
          title: 'JumpingJacks',
        },
      }),
      mockEvent(2, {
        activity: {
          id: 4,
          title: 'Dancing',
        },
      }),
      mockEvent(3, {}),
    ]);
    expect(result.length).toBe(3);
  });
  it('should cluster more than 3 events with overlaping times', () => {
    const result = doArbitraryClustering([
      mockEvent(1, {
        activity: {
          id: 5,
          title: 'JumpingJacks',
        },
        end_time: '1857-07-05T13:37:00.000Z',
        start_time: '1857-07-05T12:00:00.000Z',
      }),
      mockEvent(2, {
        activity: {
          id: 4,
          title: 'Dancing',
        },
        end_time: '1857-07-05T13:37:00.000Z',
        start_time: '1857-07-05T12:15:00.000Z',
      }),
      mockEvent(3, {
        end_time: '1857-07-05T13:37:00.000Z',
        start_time: '1857-07-05T12:30:00.000Z',
      }),
      mockEvent(4, {
        activity: {
          id: 3,
          title: 'Banana',
        },
        end_time: '1857-07-05T13:37:00.000Z',
        start_time: '1857-07-05T12:45:00.000Z',
      }),
    ]);
    expect(result.length).toBe(1);
  });
});

describe('isEventsOverlaping()', () => {
  it('returns true if starttime of timespan2 is in timespan1', () => {
    const result = isEventsOverlaping(
      {
        endTime: '1857-07-05T13:00:00.000Z',
        startTime: '1857-07-05T12:00:00.000Z',
      },
      {
        endTime: '1857-07-05T13:37:00.000Z',
        startTime: '1857-07-05T12:37:00.000Z',
      }
    );
    expect(result).toBe(true);
  });
  it('returns false if starttime of timespan2 is not in timespan1', () => {
    const result = isEventsOverlaping(
      {
        endTime: '1857-07-05T13:00:00.000Z',
        startTime: '1857-07-05T12:00:00.000Z',
      },
      {
        endTime: '1857-07-05T13:37:00.000Z',
        startTime: '1857-07-05T13:01:00.000Z',
      }
    );
    expect(result).toBe(false);
  });
});
