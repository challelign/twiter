"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import useUser from "@/hooks/useUser";

interface AvatarProps {
	userId: string;
	isLarge?: boolean;
	hasBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ userId, isLarge, hasBorder }) => {
	const router = useRouter();

	const { data: fetchedUser } = useUser(userId);

	console.log(fetchedUser);
	const onClick = useCallback(
		(event: any) => {
			event.stopPropagation();

			const url = `/users/${userId}`;

			console.log(url);
			router.push(url);
		},
		[router, userId]
	);
	//  ${isSmall ? "h-6" : "h-6"}
	// ${isSmall ? "w-6" : "w-6"}
	return (
		<div
			className={`
        ${hasBorder ? "border-4 border-black" : ""}
       ${isLarge ? "h-32" : "h-12"}
        ${isLarge ? "w-32" : "w-12"}
	
        rounded-full 
        hover:opacity-90 
        transition 
        cursor-pointer
        relative
      `}
		>
			<Image
				fill
				// width={isLarge ? 128 : 48}
				// height={isLarge ? 128 : 48}
				style={{
					objectFit: "cover",
					borderRadius: "100%",
				}}
				alt="Avatar"
				onClick={onClick}
				src={
					`/userProfile/${fetchedUser?.profileImage}` ||
					"/images/placeholder.png"
				}

				// src={fetchedUser?.profileImage || "/images/placeholder.png"}
			/>
		</div>
	);
};

export default Avatar;
