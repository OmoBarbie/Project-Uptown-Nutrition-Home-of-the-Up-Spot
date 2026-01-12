import { betterAuth } from "better-auth";
import { getDb } from "@tayo/database";

export const auth = betterAuth({
  database: getDb(),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  // Admin role configuration
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
    },
  },
  socialProviders: {
    // Disable social providers for admin
  },
});

// Type augmentation for user with role
declare module "better-auth" {
  interface User {
    role: "admin" | "user";
  }
}

export type Session = typeof auth.$Infer.Session;
