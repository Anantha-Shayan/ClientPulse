const { z } = require('zod');

const createProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
  startDate: z.string().datetime().or(z.string().min(8)),
  endDate: z.string().datetime().or(z.string().min(8)).optional(),
  budget: z.number().nonnegative().optional(),
  clientId: z.string().uuid().optional(),
  tags: z.array(z.string().min(1)).default([]),
  memberIds: z.array(z.string().uuid()).default([])
});

const updateProjectSchema = createProjectSchema.partial().omit({ memberIds: true }).extend({
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional()
});

const memberSchema = z.object({
  userId: z.string().uuid(),
  role: z.string().min(2).default('member')
});

module.exports = { createProjectSchema, updateProjectSchema, memberSchema };
