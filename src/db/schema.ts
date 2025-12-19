import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from 'drizzle-orm';

export const user = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});