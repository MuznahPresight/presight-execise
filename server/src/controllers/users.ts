import type { Request, Response } from 'express';
import { z } from 'zod';
import { findUsers } from '../models/users.js';

const MAX_SEARCH_LENGTH = 50;
const MAX_FILTER_VALUES = 20;

const filterValuesSchema = z.preprocess(
  value => {
    const values = value === undefined ? [] : Array.isArray(value) ? value : [value];
    return values
      .map(item => typeof item === 'string' ? item.trim() : item)
      .filter(item => item !== '');
  },
  z.array(z.string()).max(MAX_FILTER_VALUES)
);

const querySchema = z.object({
  search: z.string().trim().max(MAX_SEARCH_LENGTH).optional(),
  nationality: filterValuesSchema,
  hobby: filterValuesSchema,
  sortField: z.enum(['first_name', 'last_name', 'age', 'nationality']).optional().default('first_name'),
  sortDirection: z.enum(['asc', 'desc']).optional().default('asc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function getUsers(req: Request, res: Response) {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: {
        message: 'Invalid query',
        details: parsed.error.flatten(),
      },
    });
  }

  const { search, nationality, hobby, page, limit, sortField, sortDirection } = parsed.data;

  try {
    const result = findUsers(
      {
        search,
        nationalities: nationality,
        hobbies: hobby,
        sortField,
        sortDirection,
      },
      limit,
      (page - 1) * limit
    );

    res.json({
      ...result,
      page,
      limit,
      hasMore: (page - 1) * limit + result.items.length < result.total,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      error: {
        message: 'Internal server error',
      },
    });
  }
}
