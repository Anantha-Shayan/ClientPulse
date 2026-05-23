const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'member', 'client']).default('member')
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1)
});

const updateMeSchema = z.object({
  name: z.string().min(2).optional(),
  avatarUrl: z.string().url().optional()
});

module.exports = { registerSchema, loginSchema, updateMeSchema };
