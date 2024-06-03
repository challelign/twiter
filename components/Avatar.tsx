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
			<>
				{fetchedUser?.profileImage ? (
					<>
						<Image
							fill
							style={{
								objectFit: "cover",
								borderRadius: "100%",
							}}
							alt="Avatar"
							onClick={onClick}
							src={fetchedUser?.profileImage}
						/>
					</>
				) : (
					<Image
						fill
						style={{
							objectFit: "cover",
							borderRadius: "100%",
						}}
						alt="Avatar"
						onClick={onClick}
						src={"/images/placeholder.png"}
					/>
				)}
				{/* <Image
					fill
					style={{
						objectFit: "cover",
						borderRadius: "100%",
					}}
					alt="Avatar"
					onClick={onClick}
					src={
						fetchedUser?.profileImage
							? `/userProfile/${fetchedUser?.profileImage}`
							: "/images/placeholder.png"
					}
				/> */}
			</>
		</div>
	);
};

export default Avatar;
