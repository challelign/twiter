import { db } from "@/libs/prismadb";
import { serverAuth } from "@/libs/serverAuth";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
	try {
		const { userId } = await req.json();
		const currentUser = await serverAuth();
		if (!currentUser) {
			return new NextResponse("Please Login ", { status: 403 });
		}
		if (!userId || typeof userId !== "string") {
			return new NextResponse("Invalid Id ", { status: 403 });
		}
		const user = await db.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			return new NextResponse("Invalid Id", { status: 403 });
		}
		let updateFollowingIds = [...((user?.followingIds as string[]) || [])];
		updateFollowingIds.push(userId);

		//start notifications
		try {
			await db.notification.create({
				data: {
					// body: "Someone followed you!",
					body: `${user.username} followed you!`,
					userId,
				},
			});
			await db.user.update({
				where: { id: userId },
				data: {
					hasNotification: true,
				},
			});
		} catch (error) {
			console.log("notification", error);
		}
		//end notifications
		const updatedUser = await db.user.update({
			where: { id: currentUser.id },
			data: {
				followingIds: updateFollowingIds,
			},
		});
		return NextResponse.json(updatedUser);
	} catch (error) {
		console.log("FOLLOW_ERROR", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}

export async function DELETE(req: Request, res: Response) {
	try {
		const { userId } = await req.json();
		const currentUser = await serverAuth();
		if (!currentUser) {
			return new NextResponse("Please Login ", { status: 403 });
		}
		if (!userId || typeof userId !== "string") {
			return new NextResponse("Invalid Id ", { status: 403 });
		}
		const user = await db.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			return new NextResponse("Invalid Id", { status: 403 });
		}
		let updateFollowingIds = [...((user?.followingIds as string[]) || [])];

		updateFollowingIds = updateFollowingIds.filter(
			(followingId) => followingId !== userId
		);
		const updatedUser = await db.user.update({
			where: { id: currentUser.id },
			data: {
				followingIds: updateFollowingIds,
			},
		});
		return NextResponse.json(updatedUser);
	} catch (error) {
		console.log("FOLLOW_ERROR", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
