import { FC } from 'react';
import { Close } from '@mui/icons-material';
import { Box, Divider, Paper, Typography } from '@mui/material';

import { ZetkinArea } from '../types';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPerson from 'zui/ZUIPerson';

type Props = {
  area: ZetkinArea;
  assignees: ZetkinPerson[];
  onClose: () => void;
};

const AreaPlanningOverlay: FC<Props> = ({ area, assignees, onClose }) => {
  const messages = useMessages(messageIds);

  return (
    <Paper
      sx={{
        bottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 400,
        padding: 2,
        position: 'absolute',
        right: '1rem',
        top: '1rem',
        zIndex: 1000,
      }}
    >
      <Box padding={2}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">
            {area.title || messages.empty.title()}
          </Typography>
          <Close
            color="secondary"
            onClick={() => {
              onClose();
            }}
            sx={{
              cursor: 'pointer',
            }}
          />
        </Box>
        <Box paddingTop={1}>
          <Typography
            color="secondary"
            fontStyle={area.description?.trim().length ? 'inherit' : 'italic'}
            sx={{ overflowWrap: 'anywhere' }}
          >
            {area.description?.trim().length
              ? area.description
              : messages.empty.description()}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box m={1}>
        <Typography variant="h6">Assignees</Typography>
        {assignees.map((assignee) => (
          <Box key={assignee.id} my={1}>
            <ZUIPerson
              id={assignee.id}
              name={`${assignee.first_name} ${assignee.last_name}`}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default AreaPlanningOverlay;
