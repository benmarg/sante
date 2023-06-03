import { z } from "zod";
export type CreateContactInput = z.input<typeof createContactSchema>;

export const createContactSchema = z.object({
  name: z.string().trim().nonempty(),
  email: z.string().trim().email().nonempty(),
  phoneNumber: z.string().trim().nonempty(),
});
