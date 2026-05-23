const { z } = require('zod');

const createMilestoneSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']).optional(),
  dueDate: z.string().datetime().or(z.string().min(8))
});

const updateMilestoneSchema = createMilestoneSchema.partial();

module.exports = { createMilestoneSchema, updateMilestoneSchema };
