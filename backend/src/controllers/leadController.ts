import type { Request, Response } from 'express';
import * as leadService from '../services/leadService';
import { catchAsync } from '../utils/catchAsync';
import { leadsToCsv } from '../utils/csvExport';
import type {
  CreateLeadInput,
  LeadQueryInput,
  UpdateLeadInput,
} from '../validators/lead.validator';

export const getLeads = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as LeadQueryInput;
  const result = await leadService.getLeads(query, req.user!);
  res.status(200).json({
    success: true,
    ...result,
  });
});

export const exportLeads = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as LeadQueryInput;
  const leads = await leadService.exportLeadsCsv(query, req.user!);
  const csv = leadsToCsv(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=gigflow-leads-${Date.now()}.csv`
  );
  res.status(200).send(csv);
});

export const getLead = catchAsync(async (req: Request, res: Response) => {
  const lead = await leadService.getLeadById(req.params.id, req.user!);
  res.status(200).json({
    success: true,
    data: lead,
  });
});

export const createLead = catchAsync(async (req: Request, res: Response) => {
  const lead = await leadService.createLead(req.body as CreateLeadInput, req.user!);
  res.status(201).json({
    success: true,
    message: 'Lead created successfully',
    data: lead,
  });
});

export const updateLead = catchAsync(async (req: Request, res: Response) => {
  const lead = await leadService.updateLead(
    req.params.id,
    req.body as UpdateLeadInput,
    req.user!
  );
  res.status(200).json({
    success: true,
    message: 'Lead updated successfully',
    data: lead,
  });
});

export const deleteLead = catchAsync(async (req: Request, res: Response) => {
  await leadService.deleteLead(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Lead deleted successfully',
  });
});

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await leadService.getDashboardStats(req.user!);
  res.status(200).json({
    success: true,
    data: stats,
  });
});
