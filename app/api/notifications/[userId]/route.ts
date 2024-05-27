import { db } from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { userId: string } }
) {
	try {
		const userId = params.userId;
		if (!userId || typeof userId !== "string") {
			return new NextResponse("Invalid ID ", { status: 404 });
		}

		const notification = await db.notification.findMany({
			where: { userId },
			include: {
				user: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		await db.user.update({
			where: { id: userId },
			data: {
				hasNotification: false,
			},
		});
		return NextResponse.json(notification, { status: 200 });
	} catch (error) {
		console.log("[GET_USER]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
