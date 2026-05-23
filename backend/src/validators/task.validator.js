const { z } = require('zod');

const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  assignedToId: z.string().uuid().optional(),
  dueDate: z.string().datetime().or(z.string().min(8)).optional()
});

const updateTaskSchema = createTaskSchema.partial();
const commentSchema = z.object({ content: z.string().min(1) });

module.exports = { createTaskSchema, updateTaskSchema, commentSchema };
