import { db } from "@/libs/prismadb";
import { v2 as cloudinary } from "cloudinary";

import { serverAuth } from "@/libs/serverAuth";
import validateEmail from "@/libs/validateEmail";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function POST(req: Request, res: Response) {
	try {
		const { email, username, name, password } = await req.json();
		// Email validation

		if (!validateEmail(email)) {
			return new NextResponse("Invalid email format", { status: 400 });
		}
		// console.log(email, username, password, name);
		const hashedPassword = await bcrypt.hash(password, 12);

		// i can display username and email error as one response like this
		/* 	const existingUser = await db.user.findFirst({
			where: {
				OR: [
					{
						email: email,
					},
					{
						username: username,
					},
				],
			},
		}); */
		const existingEmail = await db.user.findFirst({
			where: {
				email: email,
			},
		});
		const existingUsername = await db.user.findFirst({
			where: {
				username: username,
			},
		});
		if (existingEmail) {
			return new NextResponse("This Email Exist , use different email", {
				status: 403,
			});
		}
		if (existingUsername) {
			return new NextResponse(
				"This username exist please use different username",
				{ status: 403 }
			);
		}
		const user = await db.user.create({
			data: {
				email,
				username,
				name,
				hashedPassword,
			},
		});

		console.log("USER =>", user);
		return NextResponse.json(user);
	} catch (error) {
		console.log("[REGISTER_USER]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}

export async function GET(req: Request, res: Response) {
	try {
		const users = await db.user.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		return NextResponse.json(users);
	} catch (error) {
		console.log("[GET_USER]", error);
		return new NextResponse("Internal Error ", { status: 500 });
	}
}

export async function PATCH(req: Request, res: Response) {
	try {
		const currentUser = await serverAuth();
		if (!currentUser) {
			return new NextResponse("Please Login", { status: 403 });
		}

		const { name, username, bio, profileImage, coverImage } = await req.json();
		console.log(coverImage);
		console.log(profileImage);

		if (!name || !username) {
			return new NextResponse("Missing fields", { status: 400 });
		}

		const existingUser = await db.user.findUnique({
			where: { id: currentUser.id },
		});

		if (!existingUser) {
			return new NextResponse("User not found", { status: 403 });
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

		if (
			existingUser.profileImage !== profileImage &&
			existingUser.profileImage
		) {
			await deleteOldImage(existingUser.profileImage);
		}

		if (existingUser.coverImage !== coverImage && existingUser.coverImage) {
			await deleteOldImage(existingUser.coverImage);
		}
		const updateData = await db.user.update({
			where: { id: currentUser.id },
			data: {
				name,
				username,
				bio,
				profileImage,
				coverImage,
			},
		});

		return NextResponse.json({ updateData });
	} catch (error) {
		console.log("[UPDATE_USER]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
