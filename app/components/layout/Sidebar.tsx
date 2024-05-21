"use client";
import { BsBellFill, BsHouseFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import { BiLogOut } from "react-icons/bi";
import SidebarTweetButton from "./SidebarTweetButton";
import { signOut } from "next-auth/react";
import useCurrentUser from "@/hooks/useCurrentUser";
import FollowBar from "./FollowBar";
import useUsers from "@/hooks/useUsers";
import Avatar from "../Avatar";
import FollowBarMobile from "./FollowBarMobile";

const Sidebar = () => {
	const { data: currentUser } = useCurrentUser();
	const { data: users = [] } = useUsers();
	// if (users.length === 0) {
	// 	return null;
	// }

	console.log("current user", currentUser);
	const items = [
		{
			label: "Home",
			href: "/",
			icon: BsHouseFill,
		},
		{
			label: "Notifications",
			href: "/notifications",
			icon: BsBellFill,
			auth: true,
			alert: true,
		},
		{
			label: "Profile",
			href: `/users/${currentUser?.id}`,
			icon: FaUser,
			auth: true,
		},
	];
	return (
		<div className="col-span-1 h-full pr-4 md:pr-6 sticky top-0">
			<div className="flex flex-col items-center">
				<div className="space-y-2 lg:w-[230px]">
					<SidebarLogo />
					{items.map((item) => (
						<SidebarItem
							key={item.href}
							href={item.href}
							label={item.label}
							icon={item.icon}
							auth={item.auth}
							alert={item.alert}
						/>
					))}
					{currentUser && (
						<SidebarItem
							onClick={() => signOut()}
							icon={BiLogOut}
							label="Logout"
						/>
					)}
					<SidebarTweetButton />
				</div>

				<FollowBarMobile />
			</div>
		</div>
	);
};

export default Sidebar;
