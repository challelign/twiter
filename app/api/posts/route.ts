import { db } from "@/libs/prismadb";
import { serverAuth } from "@/libs/serverAuth";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
export async function POST(req: Request, res: Response) {
	try {
		const currentUser = await serverAuth();
		console.log(currentUser);
		if (!currentUser) {
			return new NextResponse("Please Login ", { status: 403 });
		}
		const { body, bodyImage } = await req.json();
		console.log(bodyImage);
		console.log(body);
		let bodyImagePath;

		if (bodyImage) {
			bodyImagePath = await handleImageUpdate(bodyImage, "public/postImage");
		}

		console.log("bodyImagePath", bodyImagePath);

		const post = await db.post.create({
			data: {
				body,
				image: bodyImagePath,
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

async function handleImageUpdate(
	newImage: string,
	basePath: string
): Promise<string> {
	console.log(newImage);
	console.log(basePath);
	const imageBuffer = Buffer.from(newImage.split(",")[1], "base64");
	const newImagePath = `${crypto.randomUUID()}.png`;

	await fs.writeFile(path.join(basePath, newImagePath), imageBuffer);

	return newImagePath;
}
