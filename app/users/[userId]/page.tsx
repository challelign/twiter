"use client";
import Header from "@/components/Header";
import { ClipLoader } from "react-spinners";

import useUser from "@/hooks/useUser";
import UserHero from "@/components/users/UserHero";
import UserBio from "@/components/users/UserBio";
import PostFeed from "@/components/posts/PostFeed";

const userPage = ({ params }: { params: { userId: string } }) => {
	const userId = params.userId;
	const { data: fetchedUser, isLoading } = useUser(userId as string);

	if (isLoading || !fetchedUser) {
		return (
			<div className="flex justify-center items-center h-full">
				<ClipLoader color="lightblue" size={60} />
			</div>
		);
	}
	return (
		<>
			<Header showBackArrow label={fetchedUser?.name} />
			<UserHero userId={userId as string} />
			<UserBio userId={userId as string} />
			<PostFeed userId={userId as string} />
		</>
	);
};

export default userPage;
