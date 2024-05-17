import { db } from "@/libs/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request, res: Response) {
	try {
		const { email, username, name, password } = await req.json();
		console.log(email, username, password, name);
		const hashedPassword = await bcrypt.hash(password, 12);
		// const existingUser = await db.user.findFirst({
		// 	where: {
		// 		email: email,
		// 	},
		// });
		// if (existingUser) {
		// 	return new NextResponse("User Exist ", { status: 403 });
		// }
		const user = await db.user.create({
			data: {
				email,
				username,
				name,
				hashedPassword,
			},
		});

		console.log("USER =>", user);
		return NextResponse.json(user);
	} catch (error) {
		console.log("[REGISTER_USER]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}

export async function GET(req: Request, res: Response) {
	try {
		const users = await db.user.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		return NextResponse.json(users);
	} catch (error) {
		console.log("[GET_USER]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
