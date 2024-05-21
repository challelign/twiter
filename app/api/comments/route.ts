import { db } from "@/libs/prismadb";
import { serverAuth } from "@/libs/serverAuth";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
	try {
		const currentUser = await serverAuth();
		console.log(currentUser);
		if (!currentUser) {
			return new NextResponse("Please Login ", { status: 403 });
		}
		const url = new URL(req.url);
		const postId = url.searchParams.get("postId");
		if (!postId || typeof postId !== "string") {
			return new NextResponse("Invalid ID ", { status: 403 });
		}
		const { body } = await req.json();
		const post = await db.post.findUnique({
			where: {
				id: postId,
			},
		});
		if (!post) {
			return new NextResponse("Post not found ", { status: 404 });
		}
		const comment = await db.comment.create({
			data: {
				body,
				userId: currentUser?.id,
				postId: post?.id,
			},
		});

		console.log("comment =>", comment);
		return NextResponse.json(comment);
	} catch (error) {
		console.log("[CREATE_POST_COMMENT]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
export async function GET(req: Request, res: Response) {
	try {
		const url = new URL(req.url);
		const userId = url.searchParams.get("userId");

		let posts;
		if (userId && typeof userId === "string") {
			posts = await db.post.findMany({
				where: {
					userId,
				},
				include: {
					user: true,
					comments: true,
				},
				orderBy: { createdAt: "desc" },
			});
		} else {
			posts = await db.post.findMany({
				include: {
					user: true,
					comments: true,
				},
				orderBy: { createdAt: "desc" },
			});
		}
		return NextResponse.json(posts);
	} catch (error) {
		console.log("[GET_POST]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
