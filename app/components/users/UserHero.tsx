"use client";

import useUser from "@/hooks/useUser";
import Image from "next/image";
import Avatar from "../Avatar";
import { useState } from "react";

interface UserHeroProps {
	userId: string;
}
const UserHero = ({ userId }: UserHeroProps) => {
	const { data: fetchedUser, isLoading } = useUser(userId as string);
	console.log(fetchedUser);
	const [base64, setBase64] = useState(fetchedUser?.profileImage);

	return (
		<div>
			<div className="bg-neutral-700 h-44 relative">
				{fetchedUser?.coverImage && (
					<Image
						src={fetchedUser?.coverImage}
						// src={base64}
						alt="Cover Image"
						fill
						style={{ objectFit: "cover" }}
					/>
				)}
				<div className="absolute -bottom-16 left-4">
					<Avatar userId={userId} isLarge hasBorder />
				</div>
			</div>
		</div>
	);
};

export default UserHero;
