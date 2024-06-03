import { db } from "@/libs/prismadb";
import { serverAuth } from "@/libs/serverAuth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
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
		// Check and delete old images if new ones are uploaded
		const deleteOldImage = async (oldUrl: string | null) => {
			console.log("Delete old image", deleteOldImage);
			if (typeof oldUrl === "string") {
				const publicId = oldUrl.split("/").pop();
				if (publicId) {
					const publicIdWithoutExtension = publicId.split(".")[0];
					await cloudinary.uploader.destroy(publicIdWithoutExtension);
				}
			}
		};

		if (postOwner.image) {
			await deleteOldImage(postOwner.image);
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
