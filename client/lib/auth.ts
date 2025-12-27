import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb, schema } from "@tayo/database";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export function getAuth() {
  if (!authInstance) {
    authInstance = betterAuth({
      database: drizzleAdapter(getDb(), {
        provider: "pg",
        schema: {
          user: schema.users,
          session: schema.session,
          account: schema.account,
          verification: schema.verification,
        },
      }),
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true in production with email service
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day (update session every day)
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60, // 5 minutes
        },
      },
      user: {
        additionalFields: {
          role: {
            type: "string",
            required: false,
            defaultValue: "customer",
            input: false, // Don't allow setting role on signup
          },
          phone: {
            type: "string",
            required: false,
          },
        },
      },
      trustedOrigins: [
        "http://localhost:3000",
        process.env.NEXT_PUBLIC_CLIENT_URL || "",
      ],
    });
  }
  return authInstance;
}

export const auth = getAuth();

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
