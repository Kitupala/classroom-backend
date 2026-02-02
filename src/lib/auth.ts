import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_BASE_URL;
const frontendUrl = process.env.FRONTEND_URL;

if (!secret) {
        throw new Error('BETTER_AUTH_SECRET is required');
    }
if (!baseURL) {
        throw new Error('BETTER_AUTH_BASE_URL is required');
    }
if (!frontendUrl) {
        throw new Error('FRONTEND_URL is required for trustedOrigins');
    }

export const auth = betterAuth({
    secret,
    baseURL,
    trustedOrigins: [frontendUrl],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    emailAndPassword: {
        enabled: true,
    },
    account: {
        fields: {
            password: "passwordHash"
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                default: "student",
                input: false
            },
            imageCldPubId: {
                type: "string",
                required: false,
                input: true
            }
        }
    }
});