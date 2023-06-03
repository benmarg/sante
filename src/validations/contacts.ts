import { z } from "zod";
export type CreateContactInput = z.input<typeof createContactSchema>;

export const createContactSchema = z.object({
  name: z.string().trim().nonempty(),
  email: z.string().trim().email().nonempty(),
  phoneNumber: z.string().trim().nonempty(),
});

export const updateContactSchema = z.object({
  id: z.string().trim().nonempty(),
  name: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  phoneNumber: z.string().trim().optional(),
});
