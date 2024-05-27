import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./prismadb";

export const authOptions: AuthOptions = {
	providers: [
		Credentials({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					// throw new Error("Missing credentials");
					console.log("Missing credentials");
					throw new Error("Missing credentials");
					// return { error: "Missing credentials" };
				}

				const user = await db.user.findFirst({
					where: {
						email: credentials.email,
					},
				});

				if (!user || !user.id || !user.hashedPassword) {
					throw new Error("Invalid credentials");
					// return { error: "Missing credentials" };
				}

				const correctPassword = await bcrypt.compare(
					credentials.password,
					user.hashedPassword
				);

				if (!correctPassword) {
					throw new Error("Invalid credentials");
					// return { error: "Missing credentials" };
				}

				console.log("USER_FROM_Auth_options", user);
				return user;
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	debug: process.env.NODE_ENV !== "production",
};
