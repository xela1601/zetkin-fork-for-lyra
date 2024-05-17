import { ColumnKind } from '../utils/types';
import hasWrongIDFormat from '../utils/hasWrongIDFormat';
import { useAppSelector } from 'core/hooks';

interface UseUIDataColumnsReturn {
  forwardMessageDisabled: boolean;
  numColumns: number;
  numRows: number;
}

export default function useUIDataColumns(): UseUIDataColumnsReturn {
  const pendingFile = useAppSelector((state) => state.import.pendingFile);

  const sheet = pendingFile.sheets[pendingFile.selectedSheetIndex];
  const originalColumns = sheet.columns;
  const rows = sheet.rows;

  const firstRowIsHeaders = sheet.firstRowIsHeaders;

  let unfinishedMapping = false;

  originalColumns.forEach((originalColumn, index) => {
    const cellValues = rows.map((row) => row.data[index]);
    const wrongIDFormat = hasWrongIDFormat(
      originalColumn,
      cellValues,
      firstRowIsHeaders
    );

    const showTagsConfigMessage =
      originalColumn.kind == ColumnKind.TAG &&
      originalColumn.mapping.length == 0;
    const showOrgConfigMessage =
      originalColumn.kind == ColumnKind.ORGANIZATION &&
      originalColumn.mapping.length == 0;
    const showIdConfigMessage =
      originalColumn.kind == ColumnKind.ID_FIELD &&
      originalColumn.idField == null;

    if (
      showTagsConfigMessage ||
      showOrgConfigMessage ||
      showIdConfigMessage ||
      wrongIDFormat
    ) {
      unfinishedMapping = true;
    }
  });

  const noSelectedColumns = originalColumns.every(
    (column) => column.selected == false
  );

  const forwardMessageDisabled = noSelectedColumns || unfinishedMapping;

  const numRows = firstRowIsHeaders ? rows.length - 1 : rows.length;

  return {
    forwardMessageDisabled,
    numColumns: originalColumns.length,
    numRows,
  };
}
