import { db } from "@/libs/prismadb";
import { serverAuth } from "@/libs/serverAuth";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
	try {
		const { postId } = await req.json();
		const currentUser = await serverAuth();
		if (!currentUser) {
			return new NextResponse("Please Login ", { status: 403 });
		}
		if (!postId || typeof postId !== "string") {
			return new NextResponse("Invalid Id ", { status: 403 });
		}
		const post = await db.post.findUnique({
			where: { id: postId },
		});
		if (!post) {
			return new NextResponse("Invalid Id", { status: 403 });
		}
		let updateLikedIds = [...((post?.likedIds as string[]) || [])];

		//start notifications
		try {
			const post = await db.post.findUnique({
				include: {
					user: true,
				},
				where: { id: postId },
			});
			console.log(post?.user.username);
			if (post?.userId) {
				await db.notification.create({
					data: {
						// body: "Someone liked your tweet!",
						body: `${post?.user.username} liked your tweet!`,
						userId: post?.userId,
					},
				});
				await db.user.update({
					where: { id: post.userId },
					data: {
						hasNotification: true,
					},
				});
			}
		} catch (error) {
			console.log("notification", error);
		}
		//end notifications

		updateLikedIds.push(currentUser.id);
		const updatedPost = await db.post.update({
			where: { id: postId },
			data: {
				likedIds: updateLikedIds,
			},
		});
		return NextResponse.json(updatedPost);
	} catch (error) {
		console.log("FOLLOW_ERROR", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}

export async function DELETE(req: Request, res: Response) {
	try {
		const { postId } = await req.json();
		const currentUser = await serverAuth();
		if (!currentUser) {
			return new NextResponse("Please Login ", { status: 403 });
		}
		if (!postId || typeof postId !== "string") {
			return new NextResponse("Invalid Id ", { status: 403 });
		}
		const post = await db.post.findUnique({
			where: { id: postId },
		});
		if (!post) {
			return new NextResponse("Invalid Id", { status: 403 });
		}
		// initializes the updateLikedIds variable with the existing list of liked IDs
		let updateLikedIds = [...((post?.likedIds as string[]) || [])];
		// the updateLikedIds array is filtered to remove the current user's ID. This effectively "unlikes" the post for the current user.
		updateLikedIds = updateLikedIds.filter(
			(likedId) => likedId !== currentUser?.id
		);
		const updatedPost = await db.post.update({
			where: { id: postId },
			data: {
				likedIds: updateLikedIds,
			},
		});
		return NextResponse.json(updatedPost);
	} catch (error) {
		console.log("FOLLOW_ERROR", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
