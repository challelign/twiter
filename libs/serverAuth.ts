import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { db } from "./prismadb";

export const serverAuth = async () => {
	const session = await getServerSession(authOptions);
	console.log(session);
	if (!session?.user?.email) {
		throw new Error("Not signed in");
	}

	const currentUser = await db.user.findUnique({
		where: {
			email: session.user.email,
		},
	});
	return currentUser;
};
