/**
 * Converts an array of objects into a CSV string and initiates a browser download
 */
export function exportToCSV<T extends object>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
): void {
  if (!rows || rows.length === 0) {
    alert('No data available to export.');
    return;
  }

  let columnKeys: (keyof T)[];
  let columnLabels: string[];

  if (headers && headers.length > 0) {
    columnKeys = headers.map(h => h.key);
    columnLabels = headers.map(h => h.label);
  } else {
    columnKeys = Object.keys(rows[0]) as (keyof T)[];
    columnLabels = columnKeys as string[];
  }

  // Escape CSV value
  const escapeValue = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = columnLabels.map(l => `"${l}"`).join(',');
  const dataRows = rows.map(row => {
    return columnKeys.map(k => escapeValue(row[k])).join(',');
  });

  const csvContent = [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\.csv$/, '')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
