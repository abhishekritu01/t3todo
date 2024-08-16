// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { title } from "process";
import { TodoStatus } from "~/server/models/Todo";  

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `todo_${name}`);



export const todo = createTable(
  "todo",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    title: text("title", { length: 256 }),
    description: text("description", { length: 256 }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(strftime('%s', 'now'))`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" })
      .default(sql`(strftime('%s', 'now'))`)
      .notNull(),
    dueDate: text("due_date", { length: 256 }), // Use text for storing date-time
    completed: int("completed", { mode: "boolean" }).default(0), // 0 for false, 1 for true
    status: text("status", { length: 20 }).default(TodoStatus.PENDING), // Ensure this is set correctly
  }
);
