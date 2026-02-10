import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getProducts,
  getProductById,
  getCategories,
  getInventoryByProductId,
  getPromotionsByProductId,
  getUserAddresses,
  getUserPhones,
  getOrdersByUserId,
  getDb,
} from "./db";
import {
  products,
  categories,
  inventory,
  promotions,
  userAddresses,
  userPhones,
  orders,
  orderItems,
  dailySales,
} from "../drizzle/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { calculateShippingCost, formatWhatsAppMessage, generateWhatsAppLink } from "./utils/shipping";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Produtos e Categorias
  products: router({
    list: publicProcedure.query(async () => {
      return await getProducts();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        if (!product) throw new Error("Produto não encontrado");
        
        const inventory = await getInventoryByProductId(input.id);
        const promotions = await getPromotionsByProductId(input.id);
        
        return {
          ...product,
          inventory: inventory?.quantity || 0,
          promotions,
        };
      }),

    categories: publicProcedure.query(async () => {
      return await getCategories();
    }),

    // Admin: Criar produto
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          categoryId: z.number(),
          price: z.string(),
          image: z.string().optional(),
          quantity: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }

        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        const result = await db.insert(products).values({
          name: input.name,
          description: input.description,
          categoryId: input.categoryId,
          price: input.price as any,
          image: input.image,
          active: true,
        });

        const productId = (result as any).insertId;

        if (input.quantity) {
          await db.insert(inventory).values({
            productId,
            quantity: input.quantity,
          });
        }

        return { id: productId };
      }),

    // Admin: Atualizar produto
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          image: z.string().optional(),
          active: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }

        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        const updateData: any = {};
        if (input.name) updateData.name = input.name;
        if (input.description) updateData.description = input.description;
        if (input.price) updateData.price = input.price;
        if (input.image) updateData.image = input.image;
        if (input.active !== undefined) updateData.active = input.active;

        await db.update(products).set(updateData).where(eq(products.id, input.id));

        return { success: true };
      }),

    // Admin: Deletar produto
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }

        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        await db.update(products).set({ active: false }).where(eq(products.id, input.id));

        return { success: true };
      }),
  }),

  // Estoque
  inventory: router({
    getByProductId: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await getInventoryByProductId(input.productId);
      }),

    // Admin: Atualizar estoque
    update: protectedProcedure
      .input(
        z.object({
          productId: z.number(),
          quantity: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }

        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        const existing = await getInventoryByProductId(input.productId);

        if (existing) {
          await db
            .update(inventory)
            .set({ quantity: input.quantity })
            .where(eq(inventory.productId, input.productId));
        } else {
          await db.insert(inventory).values({
            productId: input.productId,
            quantity: input.quantity,
          });
        }

        return { success: true };
      }),
  }),

  // Promoções
  promotions: router({
    getByProductId: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await getPromotionsByProductId(input.productId);
      }),

    // Admin: Criar promoção
    create: protectedProcedure
      .input(
        z.object({
          productId: z.number(),
          discountPercent: z.string(),
          startDate: z.string(),
          endDate: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }

        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        await db.insert(promotions).values({
          productId: input.productId,
          discountPercent: input.discountPercent as any,
          startDate: input.startDate as any,
          endDate: input.endDate as any,
          active: true,
        });

        return { success: true };
      }),

    // Admin: Deletar promoção
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }

        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        await db.update(promotions).set({ active: false }).where(eq(promotions.id, input.id));

        return { success: true };
      }),
  }),

  // Endereços do usuário
  addresses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserAddresses(ctx.user!.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          street: z.string(),
          number: z.string(),
          complement: z.string().optional(),
          city: z.string(),
          state: z.string(),
          zipCode: z.string(),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        await db.insert(userAddresses).values({
          userId: ctx.user!.id,
          street: input.street,
          number: input.number,
          complement: input.complement,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          isDefault: input.isDefault || false,
        });

        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          street: z.string().optional(),
          number: z.string().optional(),
          complement: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        const updateData: any = {};
        if (input.street) updateData.street = input.street;
        if (input.number) updateData.number = input.number;
        if (input.complement) updateData.complement = input.complement;
        if (input.city) updateData.city = input.city;
        if (input.state) updateData.state = input.state;
        if (input.zipCode) updateData.zipCode = input.zipCode;
        if (input.isDefault !== undefined) updateData.isDefault = input.isDefault;

        await db.update(userAddresses).set(updateData).where(eq(userAddresses.id, input.id));

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        await db.delete(userAddresses).where(eq(userAddresses.id, input.id));

        return { success: true };
      }),
  }),

  // Telefones do usuário
  phones: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserPhones(ctx.user!.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          phone: z.string(),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        await db.insert(userPhones).values({
          userId: ctx.user!.id,
          phone: input.phone,
          isDefault: input.isDefault || false,
        });

        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          phone: z.string().optional(),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        const updateData: any = {};
        if (input.phone) updateData.phone = input.phone;
        if (input.isDefault !== undefined) updateData.isDefault = input.isDefault;

        await db.update(userPhones).set(updateData).where(eq(userPhones.id, input.id));

        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        await db.delete(userPhones).where(eq(userPhones.id, input.id));

        return { success: true };
      }),
  }),

  // Pedidos
  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getOrdersByUserId(ctx.user!.id);
    }),

    getUserOrders: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        const userOrders = await db
          .select()
          .from(orders)
          .where(eq(orders.userId, input.userId))
          .orderBy(desc(orders.createdAt));

        // Buscar itens para cada pedido
        const ordersWithItems = await Promise.all(
          userOrders.map(async (order) => {
            const items = await db
              .select()
              .from(orderItems)
              .where(eq(orderItems.orderId, order.id));
            return {
              ...order,
              items,
            };
          })
        );

        return ordersWithItems;
      }),

    create: protectedProcedure
      .input(
        z.object({
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number(),
              price: z.string(),
            })
          ),
          addressId: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        const totalAmount = input.items.reduce((sum, item) => {
          return sum + parseFloat(item.price) * item.quantity;
        }, 0);

        const orderResult = await db.insert(orders).values({
          userId: ctx.user!.id,
          totalAmount: totalAmount.toString() as any,
          status: "pending",
          addressId: input.addressId,
        });

        const orderId = (orderResult as any).insertId;

        for (const item of input.items) {
          await db.insert(orderItems).values({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price as any,
          });
        }

        // Atualizar vendas diárias
        const today = new Date().toISOString().split("T")[0];
        const existingSales = await db
          .select()
          .from(dailySales)
          .where(eq(dailySales.date, today as any))
          .limit(1);

        if (existingSales.length > 0) {
          await db
            .update(dailySales)
            .set({
              totalSales: (
                parseFloat(existingSales[0].totalSales as any) + totalAmount
              ).toString() as any,
              orderCount: existingSales[0].orderCount + 1,
            })
            .where(eq(dailySales.date, today as any));
        } else {
          await db.insert(dailySales).values({
            date: today as any,
            totalSales: totalAmount.toString() as any,
            orderCount: 1,
          });
        }

        return { id: orderId };
      }),
  }),

  // Pagamentos (PIX)
  payments: router({
    createPixPayment: protectedProcedure
      .input(
        z.object({
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number(),
              price: z.string(),
            })
          ),
          addressId: z.number(),
          shippingCost: z.number(),
          customerPhone: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const db = await getDb();
          if (!db) throw new Error("Banco de dados indisponivel");

          const addressResult = await db
            .select()
            .from(userAddresses)
            .where(eq(userAddresses.id, input.addressId))
            .limit(1);

          if (!addressResult.length) {
            throw new Error("Endereco nao encontrado");
          }

          const address = addressResult[0];
          const totalAmount = input.items.reduce((sum, item) => {
            return sum + parseFloat(item.price) * item.quantity;
          }, 0) + input.shippingCost;

          const orderResult = await db.insert(orders).values({
            userId: ctx.user!.id,
            totalAmount: totalAmount.toString() as any,
            status: "pending",
            addressId: input.addressId,
          });

          const orderId = (orderResult as any).insertId;

          for (const item of input.items) {
            await db.insert(orderItems).values({
              orderId,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price as any,
            });
          }

          const pixQrCode = "00020126580014br.gov.bcb.brcode0136123e4567-e12b-12d1-a456-426655440000520400005303986540510.005802BR5913Farmacia Saude Certa6009Cabo de Santo Agostinho62410503***63041D3F";

          const whatsappMessage = formatWhatsAppMessage({
            orderId,
            customerName: ctx.user?.name || "Cliente",
            customerPhone: input.customerPhone,
            customerEmail: ctx.user?.email || "",
            items: input.items,
            subtotal: totalAmount - input.shippingCost,
            shippingCost: input.shippingCost,
            total: totalAmount,
            address: {
              street: address.street,
              number: address.number,
              complement: address.complement || undefined,
              city: address.city,
              state: address.state,
              zipCode: address.zipCode,
            },
            paymentMethod: "pix",
            pixQrCode,
          });

          const whatsappLink = generateWhatsAppLink(input.customerPhone, whatsappMessage);

          return {
            orderId,
            pixQrCode,
            whatsappLink,
            message: whatsappMessage,
            total: totalAmount,
          };
        } catch (error) {
          console.error("Erro ao criar pagamento PIX:", error);
          throw new Error("Erro ao processar pagamento PIX");
        }
      }),
  }),

  // Stripe Payments
  stripe: router({
    createCheckoutSession: protectedProcedure
      .input(
        z.object({
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number(),
              price: z.string(),
            })
          ),
          addressId: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
          const origin = ctx.req.headers.origin || "http://localhost:3000";

          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: input.items.map((item: any) => ({
              price_data: {
                currency: "brl",
                product_data: {
                  name: `Produto #${item.productId}`,
                  description: `Quantidade: ${item.quantity}`,
                },
                unit_amount: Math.round(parseFloat(item.price) * 100),
              },
              quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart`,
            customer_email: ctx.user?.email,
            client_reference_id: ctx.user?.id.toString(),
            metadata: {
              user_id: ctx.user?.id.toString(),
              address_id: input.addressId.toString(),
              customer_email: ctx.user?.email || "",
              customer_name: ctx.user?.name || "",
            },
          });

          return { checkoutUrl: session.url };
        } catch (error) {
          console.error("Erro ao criar checkout session:", error);
          throw new Error("Erro ao processar pagamento");
        }
      }),
  }),

  // Relatórios (Admin)
  reports: router({
    dailySales: protectedProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }

        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        const result = await db
          .select()
          .from(dailySales)
          .where(eq(dailySales.date, input.date as any))
          .limit(1);

        return result[0] || null;
      }),

    weeklySales: protectedProcedure
      .input(z.object({ startDate: z.string(), endDate: z.string() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }

        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        return await db
          .select()
          .from(dailySales)
          .where(
            and(
              gte(dailySales.date, input.startDate as any),
              lte(dailySales.date, input.endDate as any)
            )
          );
      }),

    monthlySales: protectedProcedure
      .input(z.object({ month: z.string() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Acesso negado");
        }

        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");

        const [year, month] = input.month.split("-");
        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-31`;

        return await db
          .select()
          .from(dailySales)
          .where(
            and(
              gte(dailySales.date, startDate as any),
              lte(dailySales.date, endDate as any)
            )
          );
      }),
  }),
});

export type AppRouter = typeof appRouter;
