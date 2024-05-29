import { db } from "@/libs/prismadb";
import { serverAuth } from "@/libs/serverAuth";
import validateEmail from "@/libs/validateEmail";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

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
// export async function PATCH(req: Request, res: Response) {
// 	try {
// 		const currentUser = await serverAuth();
// 		if (!currentUser) {
// 			return new NextResponse("Please Login ", { status: 403 });
// 		}
// 		console.log("await", await req.json());
// 		const { name, username, bio, profileImage, coverImage } = await req.json();

// 		if (!name || !username) {
// 			return new NextResponse("Missing fields ", { status: 404 });
// 		}
// 		console.log(profileImage);
// 		console.log(coverImage);
// 		await fs.mkdir("userProfile", { recursive: true });
// 		const filePathProfile = `userProfile/${crypto.randomUUID()}-${profileImage.file.name}`;
// 		await fs.writeFile(
// 			filePathProfile,
// 			Buffer.from(await profileImage.file.arrayBuffer())
// 		);

// 		await fs.mkdir("public/userProfile", { recursive: true });
// 		const imageCoverPath = `/userProfile/${crypto.randomUUID()}-${coverImage.image.name}`;
// 		await fs.writeFile(
// 			`public${imageCoverPath}`,
// 			Buffer.from(await coverImage.image.arrayBuffer())
// 		);

// 		const updateData = await db.user.update({
// 			where: { id: currentUser?.id },
// 			data: {
// 				name,
// 				username,
// 				bio,
// 				profileImage: filePathProfile,
// 				coverImage: imageCoverPath,
// 			},
// 		});
// 		console.log("[UPDATE_DATA]", updateData);
// 		return NextResponse.json({ updateData });
// 	} catch (error) {
// 		console.log("[UPDATE_USER]", error);
// 		return new NextResponse("Internal Error ", { status: 500 });
// 	}
// }

/**	SATURDAY */
/* export async function PATCH(req: Request, res: Response) {
	try {
		const currentUser = await serverAuth();
		if (!currentUser) {
			return new NextResponse("Please Login", { status: 403 });
		}

		const { name, username, bio, profileImage, coverImage } = await req.json();

		if (!name || !username) {
			return new NextResponse("Missing fields", { status: 400 });
		}

		let profileImagePath = null;
		let coverImagePath = null;

		const existingUser = await db.user.findUnique({
			where: { id: currentUser.id },
		});
		if (!existingUser) {
			return new NextResponse("User not found", { status: 403 });
		}

		if (profileImage) {
			// Delete existing profile image if it exists
			if (existingUser.profileImage) {
				const existingProfileImagePath = path.join(
					"public/userProfile",
					existingUser.profileImage
				);
				try {
					await fs.unlink(existingProfileImagePath);
				} catch (error) {
					console.log("Error deleting existing profile image:", error);
				}
			}
			// Save new profile image

			const profileImageBuffer = Buffer.from(
				profileImage.split(",")[1],
				"base64"
			);
			profileImagePath = `${crypto.randomUUID()}.png`;

			await fs.writeFile(
				path.join("public/userProfile/", profileImagePath),
				profileImageBuffer
			);
		} else {
			profileImagePath = existingUser.profileImage || null;
		}

		// Save new cover image
		if (coverImage) {
			// Delete existing cover image if it exists
			if (existingUser.coverImage) {
				const existingCoverImagePath = path.join(
					"public/userProfile",
					existingUser.coverImage
				);
				try {
					await fs.unlink(existingCoverImagePath);
				} catch (error) {
					console.log("Error deleting existing cover image:", error);
					return;
				}
			}
			const coverImageBuffer = Buffer.from(coverImage.split(",")[1], "base64");
			coverImagePath = `${crypto.randomUUID()}.png`;

			await fs.writeFile(
				path.join("public/userProfile/", coverImagePath),
				coverImageBuffer
			);
		} else {
			coverImagePath = existingUser.coverImage || null;
		}

		const updateData = await db.user.update({
			where: { id: currentUser.id },
			data: {
				name,
				username,
				bio,
				profileImage: profileImagePath,
				coverImage: coverImagePath,
			},
		});
		revalidatePath("/users");

		return NextResponse.json({ updateData });
	} catch (error) {
		console.log("[UPDATE_USER]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
 */
export async function PATCH(req: Request, res: Response) {
	try {
		const currentUser = await serverAuth();
		if (!currentUser) {
			return new NextResponse("Please Login", { status: 403 });
		}

		const { name, username, bio, profileImage, coverImage } = await req.json();
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

		let profileImagePath = existingUser.profileImage || null;
		let coverImagePath = existingUser.coverImage || null;

		// Handle profile image if provided
		if (profileImage) {
			profileImagePath = await handleImageUpdate(
				existingUser.profileImage, //existingImagePath
				profileImage, //newImage
				"public/userProfile" //basePath
			);
		}

		// Handle cover image if provided
		if (coverImage) {
			coverImagePath = await handleImageUpdate(
				existingUser.coverImage,
				coverImage,
				"public/userProfile"
			);
		}

		const updateData = await db.user.update({
			where: { id: currentUser.id },
			data: {
				name,
				username,
				bio,
				profileImage: profileImagePath,
				coverImage: coverImagePath,
			},
		});

		return NextResponse.json({ updateData });
	} catch (error) {
		console.log("[UPDATE_USER]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
async function handleImageUpdate(
	existingImagePath: string | null,
	newImage: string,
	basePath: string
): Promise<string> {
	if (existingImagePath) {
		console.log(existingImagePath);
		const existingPath = path.join(basePath, existingImagePath);
		console.log(existingPath);

		try {
			await fs.unlink(existingPath);
		} catch (error) {
			console.log("Error deleting existing image:", error);
		}
	}

	const imageBuffer = Buffer.from(newImage.split(",")[1], "base64");
	const newImagePath = `${crypto.randomUUID()}.png`;

	await fs.writeFile(path.join(basePath, newImagePath), imageBuffer);

	return newImagePath;
}
