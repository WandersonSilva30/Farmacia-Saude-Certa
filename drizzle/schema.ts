import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, date } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Categorias de produtos
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// Produtos
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  categoryId: int("categoryId").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Estoque
export const inventory = mysqlTable("inventory", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  quantity: int("quantity").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;

// Promoções
export const promotions = mysqlTable("promotions", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  discountPercent: decimal("discountPercent", { precision: 5, scale: 2 }).notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = typeof promotions.$inferInsert;

// Endereços do usuário
export const userAddresses = mysqlTable("userAddresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  street: varchar("street", { length: 255 }).notNull(),
  number: varchar("number", { length: 50 }).notNull(),
  complement: varchar("complement", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zipCode: varchar("zipCode", { length: 10 }).notNull(),
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserAddress = typeof userAddresses.$inferSelect;
export type InsertUserAddress = typeof userAddresses.$inferInsert;

// Telefones do usuário
export const userPhones = mysqlTable("userPhones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserPhone = typeof userPhones.$inferSelect;
export type InsertUserPhone = typeof userPhones.$inferInsert;

// Pedidos
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
  addressId: int("addressId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Itens do pedido
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// Vendas diárias (para relatórios)
export const dailySales = mysqlTable("dailySales", {
  id: int("id").autoincrement().primaryKey(),
  date: date("date").notNull(),
  totalSales: decimal("totalSales", { precision: 10, scale: 2 }).default("0").notNull(),
  orderCount: int("orderCount").default(0).notNull(),
});

export type DailySales = typeof dailySales.$inferSelect;
export type InsertDailySales = typeof dailySales.$inferInsert;

// Aviações de clientes
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5 estrelas
  comment: text("comment"),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;