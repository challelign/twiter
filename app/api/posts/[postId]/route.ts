import { db } from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { postId: string } }
) {
	try {
		const postId = params.postId;
		console.log(postId);
		if (!postId || typeof postId !== "string") {
			return new NextResponse("Invalid ID ", { status: 404 });
		}
		const post = await db.post.findUnique({
			where: {
				id: postId,
			},
			include: {
				user: true,
				comments: {
					include: {
						user: true,
					},
					orderBy: {
						createdAt: "desc",
					},
				},
			},
		});

		console.log(post);
		return NextResponse.json(post);
	} catch (error) {
		console.log("[GET_USER]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}
