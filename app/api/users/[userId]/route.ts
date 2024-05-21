import { db } from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { userId: string } }
) {
	try {
		const userId = params.userId;
		console.log(userId);
		if (!userId || typeof userId !== "string") {
			return new NextResponse("Invalid ID ", { status: 404 });
		}
		const existingUser = await db.user.findUnique({
			where: {
				id: userId,
			},
		});

		const followersCount = await db.user.count({
			where: {
				followingIds: {
					array_contains: userId,
				},
			},
		});

		return NextResponse.json({ ...existingUser, followersCount });
	} catch (error) {
		console.log("[GET_USER]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
