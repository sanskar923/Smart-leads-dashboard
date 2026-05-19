import type { ILeadPopulated } from '../interfaces/lead.interface';

const escapeCsvField = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const leadsToCsv = (leads: ILeadPopulated[]): string => {
  const headers = [
    'Name',
    'Email',
    'Status',
    'Source',
    'Assigned To',
    'Assigned Email',
    'Created At',
  ];

  const rows = leads.map((lead) => [
    escapeCsvField(lead.name),
    escapeCsvField(lead.email),
    escapeCsvField(lead.status),
    escapeCsvField(lead.source),
    escapeCsvField(lead.assignedTo.name),
    escapeCsvField(lead.assignedTo.email),
    escapeCsvField(new Date(lead.createdAt ?? '').toISOString()),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
};
