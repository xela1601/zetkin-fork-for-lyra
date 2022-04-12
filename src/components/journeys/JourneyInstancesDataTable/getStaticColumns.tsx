import dayjs from 'dayjs';
import { GridColDef } from '@mui/x-data-grid-pro';

import PersonHoverCard from 'components/PersonHoverCard';
import ZetkinPerson from 'components/ZetkinPerson';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ZetkinJourney, ZetkinPerson as ZetkinPersonType } from 'types/zetkin';

// Name concatenation
const getPeopleString = (people: ZetkinPersonType[]) =>
  people.map((person) => `${person.first_name} ${person.last_name}`).join(', ');

export const getStaticColumns = (journey: ZetkinJourney): GridColDef[] => [
  {
    field: 'id',
    valueFormatter: (params) => {
      return `${journey.singular_label} #${params.value}`;
    },
  },
  {
    field: 'subjects',
    valueGetter: (params) =>
      getPeopleString(params.value as ZetkinPersonType[]),
  },
  {
    field: 'created',
    type: 'date',
    valueFormatter: (params) =>
      dayjs(params.value as string).format('MMMM D, YYYY'),
  },
  {
    field: 'updated',
    renderCell: (params) => (
      <ZetkinRelativeTime datetime={params.value as string} />
    ),
    type: 'date',
  },
  {
    field: 'next_milestone_title',
    valueGetter: (params) => params.row.next_milestone.title,
  },
  {
    field: 'next_milestone_deadline',
    renderCell: (params) => (
      <ZetkinRelativeTime datetime={params.value as string} />
    ),
    type: 'date',
    valueGetter: (params) => params.row.next_milestone.deadline,
  },
  {
    field: 'summary',
  },
  {
    field: 'assignees',
    renderCell: (params) =>
      (params.row.assignees as ZetkinPersonType[]).map((person) => (
        <PersonHoverCard key={person.id} personId={person.id}>
          <ZetkinPerson
            containerProps={{ style: { marginRight: 10 } }}
            id={person.id}
            link
            name={`${person.first_name} ${person.last_name}`}
            showText={false}
          />
        </PersonHoverCard>
      )),
    valueGetter: (params) =>
      (params.row.assignees as ZetkinPersonType[])
        .map((person) => `${person.first_name} ${person.last_name}`)
        .join(', '),
  },
];
