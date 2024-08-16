import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { todo } from "~/server/db/schema";
import { db } from "~/server/db/index";
import { eq } from "drizzle-orm";
import {TodoStatus} from "~/server/models/Todo";



export const todoRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => ({
            greeting: `Hello this is Abhishek ${input.text}`,
        })),

    gettodos: publicProcedure
        .query(async () => {
            try {
                const todos = await db.select().from(todo).run();
                return todos;
            } catch (error) {
                console.error("Error fetching todos:", error);
                throw new Error("Failed to fetch todos");
            }
        }),

    addtodo: publicProcedure
        .input(z.object({
            title: z.string(),
            description: z.string(),
            dueDate: z.string().optional(),
            status: z.enum([TodoStatus.PENDING, TodoStatus.IN_PROGRESS, TodoStatus.IN_PROGRESS,TodoStatus.ON_HOLD,TodoStatus.CANCELLED,TodoStatus.REVIEW]).optional(),
        }))
        .mutation(async ({ input }) => {
            try {
                const newTodo = await db.insert(todo)
                    .values({
                        title: input.title,
                        description: input.description,
                        dueDate: input.dueDate || null,
                        status: input.status || TodoStatus.IN_PROGRESS, 
                    })
                    .run();
                return newTodo;
            } catch (error) {
                console.error('Error adding todo:', error);
                throw new Error('Failed to add todo');
            }
        }),

    deletetodo: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            try {
                await db.delete(todo).where(eq(todo.id, input.id)).run();
                return { id: input.id };
            } catch (error) {
                console.error("Error deleting todo:", error);
                throw new Error("Failed to delete todo");
            }
        }),

    updatetodo: publicProcedure
    .input(z.object({
        id: z.number(),
        title: z.string(),
        description: z.string(),
        dueDate: z.string().optional(),
        completed: z.boolean(), 
        status: z.enum([TodoStatus.PENDING, TodoStatus.IN_PROGRESS, TodoStatus.IN_PROGRESS,TodoStatus.ON_HOLD,TodoStatus.CANCELLED,TodoStatus.REVIEW]).optional(),      
    }))
    .mutation(async ({ input }) => {
        try {
            const updatedTodo = await db.update(todo)
                .set({
                    title: input.title,
                    description: input.description,
                    dueDate: input.dueDate || null,
                    completed: input.completed,
                    status: input.status || TodoStatus.IN_PROGRESS,
                })
                .where(eq(todo.id, input.id))
                .run();
            return updatedTodo;
        } catch (error) {
            console.error('Error updating todo:', error);
            throw new Error('Failed to update todo');
        }
    }),
});
