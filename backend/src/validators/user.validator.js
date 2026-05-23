const { z } = require('zod');

const statusSchema = z.object({ status: z.enum(['active', 'inactive']) });

const inviteClientSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

module.exports = { statusSchema, inviteClientSchema };
