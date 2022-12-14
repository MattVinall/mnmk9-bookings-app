import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const bookingRouter = router({
	getAllBookings: protectedProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.bookings.findMany();
	}),
	byId: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			try {
				const { id } = input;
				return await ctx.prisma.bookings.findUnique({ where: { id } })
			} catch (error) {
				console.log(`Booking cannot be fetched by ID: ${error}`)
			}
		}),
	newBooking: protectedProcedure
		.input(
			z.object({
				firstName: z.string(),
				lastName: z.string(),
				phoneNumber: z.string(),
				email: z.string(),
				checkInDate: z.string(),
				checkOutDate: z.string().optional(),
				startTime: z.string().optional(),
				endTime: z.string().optional(),
				petName: z.string(),
				notes: z.string().optional(),
				serviceName: z.string(),
				petId: z.string(),
				serviceId: z.string(),
				userId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const { firstName, lastName, phoneNumber, email, checkInDate, checkOutDate, petName, notes, startTime, endTime, serviceName, petId, serviceId, userId } = input
				return await ctx.prisma.bookings.create({
					data: {
						firstName,
						lastName,
						phoneNumber,
						email,
						checkInDate,
						checkOutDate,
						startTime,
						endTime,
						petName,
						notes,
						serviceName,
						petId,
						serviceId,
						userId
					}
				})
			} catch (error) {
				console.log(`booking could not be created: ${error}`)
			}
		}),
	editBooking: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				checkInDate: z.string().optional(),
				checkOutDate: z.string().optional(),
				startTime: z.string().optional(),
				endTime: z.string().optional(),
				notes: z.string().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, checkInDate, checkOutDate, startTime, endTime, notes } = input;

			try {
				return await ctx.prisma.bookings.update({
					where: {
						id,
					}, 
					data: {
						checkInDate,
						checkOutDate,
						startTime, 
						endTime, 
						notes
					}
				})
			} catch (error) {
				console.log(`booking could not be edited: ${error}`)
			}
		}),
	cancelBooking: protectedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id } = input;

			try {
				return await ctx.prisma.bookings.delete({
					where: {
						id
					}
				})
			} catch (error) {
				console.log(`booking could not be cancelled/deleted: ${error}`)
			}
		}),
	confirmBooking: protectedProcedure
		.input(
			z.object({
				id: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id } = input;

			try {
				return await ctx.prisma.bookings.update({
					where: {
						id
					},
					data: {
						confirmedBooking: true
					}
				});

			} catch (error) {
				console.log(`error updating booking status to confirmed: ${error}`)
			}
		})
});