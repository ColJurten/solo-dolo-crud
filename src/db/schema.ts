import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from 'drizzle-orm';

export const role = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const user = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  roleId: uuid('role_id').references(() => role.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const roleRelations = relations(role, ({ many }) => ({
  users: many(user),
}));

export const userRelations = relations(user, ({ one }) => ({
  role: one(role, {
    fields: [user.roleId],
    references: [role.id],
  }),
}));

export type Role = InferSelectModel<typeof role>;
export type NewRole = InferInsertModel<typeof role>;
export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;