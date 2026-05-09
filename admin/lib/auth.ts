import { getAuthDb } from "@tayo/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(getAuthDb(), {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer" },
    },
  },
  socialProviders: {},
  advanced: {
    cookiePrefix: "tayo-admin",
  },
});

// declare module "better-auth" {
//   interface User {
//     role: "admin" | "user";
//   }
// }

export type Session = typeof auth.$Infer.Session;
