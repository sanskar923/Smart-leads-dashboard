import type { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';
import { Lead } from '../models/Lead';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import type {
  ILeadDocument,
  ILeadPopulated,
  LeadSort,
  PaginatedResponse,
} from '../interfaces/lead.interface';
import type { IUserDocument } from '../interfaces/user.interface';
import type {
  CreateLeadInput,
  LeadQueryInput,
  UpdateLeadInput,
} from '../validators/lead.validator';

const PAGE_SIZE = 10;

const buildFilter = (
  query: LeadQueryInput,
  user: IUserDocument
): FilterQuery<ILeadDocument> => {
  const filter: FilterQuery<ILeadDocument> = {};

  if (user.role === 'Sales User') {
    filter.assignedTo = user._id;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

const getSortOption = (sort: LeadSort): Record<string, 1 | -1> => ({
  createdAt: sort === 'latest' ? -1 : 1,
});

const populateOptions = [
  { path: 'assignedTo', select: 'name email role' },
  { path: 'createdBy', select: 'name email' },
];

export const getLeads = async (
  query: LeadQueryInput,
  user: IUserDocument
): Promise<PaginatedResponse<ILeadPopulated>> => {
  const filter = buildFilter(query, user);
  const sort = getSortOption(query.sort);
  const page = query.page;
  const skip = (page - 1) * PAGE_SIZE;

  const [leads, totalRecords] = await Promise.all([
    Lead.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(PAGE_SIZE)
      .populate(populateOptions)
      .lean<ILeadPopulated[]>(),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalRecords / PAGE_SIZE) || 1;

  return {
    data: leads,
    currentPage: page,
    totalPages,
    totalRecords,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const exportLeadsCsv = async (
  query: Omit<LeadQueryInput, 'page' | 'export'>,
  user: IUserDocument
): Promise<ILeadPopulated[]> => {
  const filter = buildFilter({ ...query, page: 1 }, user);
  const sort = getSortOption(query.sort);

  return Lead.find(filter)
    .sort(sort)
    .populate(populateOptions)
    .lean<ILeadPopulated[]>();
};

export const getLeadById = async (
  id: string,
  user: IUserDocument
): Promise<ILeadPopulated> => {
  const lead = await Lead.findById(id).populate(populateOptions).lean<ILeadPopulated>();

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  if (
    user.role === 'Sales User' &&
    lead.assignedTo._id.toString() !== user._id.toString()
  ) {
    throw new AppError('You do not have permission to view this lead', 403);
  }

  return lead;
};

export const createLead = async (
  input: CreateLeadInput,
  user: IUserDocument
): Promise<ILeadPopulated> => {
  const assignee = await User.findById(input.assignedTo);
  if (!assignee) {
    throw new AppError('Assigned user not found', 404);
  }

  const lead = await Lead.create({
    ...input,
    assignedTo: new Types.ObjectId(input.assignedTo),
    createdBy: user._id,
  });

  const populated = await Lead.findById(lead._id)
    .populate(populateOptions)
    .lean<ILeadPopulated>();

  if (!populated) {
    throw new AppError('Failed to create lead', 500);
  }

  return populated;
};

export const updateLead = async (
  id: string,
  input: UpdateLeadInput,
  user: IUserDocument
): Promise<ILeadPopulated> => {
  const lead = await Lead.findById(id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  if (
    user.role === 'Sales User' &&
    lead.assignedTo.toString() !== user._id.toString()
  ) {
    throw new AppError('You can only update leads assigned to you', 403);
  }

  if (input.assignedTo) {
    const assignee = await User.findById(input.assignedTo);
    if (!assignee) {
      throw new AppError('Assigned user not found', 404);
    }
    lead.assignedTo = new Types.ObjectId(input.assignedTo);
  }

  if (input.name) lead.name = input.name;
  if (input.email) lead.email = input.email;
  if (input.status) lead.status = input.status;
  if (input.source) lead.source = input.source;

  await lead.save();

  const populated = await Lead.findById(lead._id)
    .populate(populateOptions)
    .lean<ILeadPopulated>();

  if (!populated) {
    throw new AppError('Failed to update lead', 500);
  }

  return populated;
};

export const deleteLead = async (id: string): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
};

export interface DashboardStats {
  total: number;
  qualified: number;
  lost: number;
  contacted: number;
  new: number;
}

export const getDashboardStats = async (
  user: IUserDocument
): Promise<DashboardStats> => {
  const match: FilterQuery<ILeadDocument> =
    user.role === 'Sales User' ? { assignedTo: user._id } : {};

  const stats = await Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        qualified: {
          $sum: { $cond: [{ $eq: ['$status', 'Qualified'] }, 1, 0] },
        },
        lost: {
          $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] },
        },
        contacted: {
          $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] },
        },
        new: {
          $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] },
        },
      },
    },
  ]);

  const result = stats[0] as DashboardStats | undefined;
  return result ?? { total: 0, qualified: 0, lost: 0, contacted: 0, new: 0 };
};
