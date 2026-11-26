const { z } = require("zod");
const createChatSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
});
const updateChatSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    pinned: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0);
const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(12000),
});
module.exports = { createChatSchema, updateChatSchema, messageSchema };
