import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/libs/prismadb";
import { authOptions } from "@/libs/authOptions";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		console.log("SESSION", session);

		if (!session?.user?.email) {
			throw new Error("Not signed in");
		}

		const currentUser = await db.user.findUnique({
			where: {
				email: session.user.email,
			},
		});

		console.log("CurrentUserFrom Server Auth", currentUser);
		if (!currentUser) {
			throw new Error("Not signed in");
		}
		// console.log("Action", currentUser);
		return NextResponse.json(currentUser);
	} catch (error) {
		console.log("[CURRENT_USER]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
