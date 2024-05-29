import { db } from "@/libs/prismadb";
import { serverAuth } from "@/libs/serverAuth";
import crypto from "crypto";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
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

export async function DELETE(
	req: Request,
	{ params }: { params: { postId: string } }
) {
	try {
		const postId = params.postId;
		const currentUser = await serverAuth();
		if (!currentUser) {
			return new NextResponse("Please Login ", { status: 403 });
		}
		if (!postId || typeof postId !== "string") {
			return new NextResponse("Invalid ID ", { status: 404 });
		}

		const postOwner = await db.post.findUnique({
			where: {
				id: postId,
				userId: currentUser?.id,
			},
		});

		if (!postOwner) {
			return new NextResponse("Unauthorized ", { status: 403 });
		}
		// delete the image
		if (postOwner.image) {
			const existingPath = path.join("public/postImage", postOwner.image);
			try {
				await fs.unlink(existingPath);
			} catch (error) {
				console.log("Error deleting existing image:", error);
			}
		}
		// delete the post

		const deletedPost = await db.post.delete({
			where: {
				id: postId,
			},
		});

		console.log(deletedPost);
		return NextResponse.json(deletedPost);
	} catch (error) {
		console.log("[GET_USER]", error);
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
