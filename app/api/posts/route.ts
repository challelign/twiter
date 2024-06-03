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
		const { body, bodyImage } = await req.json();

		const post = await db.post.create({
			data: {
				body,
				image: bodyImage,
				userId: currentUser?.id,
			},
		});

		console.log("POST =>", post);
		return NextResponse.json(post);
	} catch (error) {
		console.log("[CREATE_POST]", error);
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
