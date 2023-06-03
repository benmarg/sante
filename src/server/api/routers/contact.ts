import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  createContactSchema,
  updateContactSchema,
} from "~/validations/contacts";

export const contactRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.contact.findMany();
  }),
  create: publicProcedure
    .input(createContactSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contact.create({
        data: input,
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.contact.delete({
      where: {
        id: input,
      },
    });
  }),
  update: publicProcedure
    .input(updateContactSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contact.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
});
