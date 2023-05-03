import { FC } from 'react';
import { Box, Divider } from '@mui/material';

import { EventsModel } from '../models/EventsModel';
import messageIds from 'features/events/l10n/messageIds';
import RelatedEventCard from './LocationModal/RelatedEventCard';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';

interface EventRelatedCardProps {
  data: ZetkinEvent;
  model: EventsModel;
}

const EventRelatedCard: FC<EventRelatedCardProps> = ({ data, model }) => {
  const messages = useMessages(messageIds);

  return (
    <Box mt={2}>
      <ZUICard header={messages.eventRelatedCard.header()}>
        <Divider />
        <ZUIFuture
          future={model.getParallelEvents(data.start_time, data.end_time)}
        >
          {(data) => {
            return (
              <>
                {data.map((event) => {
                  return (
                    <>
                      <Divider />
                      <Box m={1}>
                        <RelatedEventCard event={event} />
                      </Box>
                    </>
                  );
                })}
              </>
            );
          }}
        </ZUIFuture>
        <Divider />
      </ZUICard>
    </Box>
  );
};

export default EventRelatedCard;
