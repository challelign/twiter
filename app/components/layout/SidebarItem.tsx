"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";

interface SidebarItemProps {
	href?: string;
	label: string;
	icon: IconType;
	onClick?: () => void;
	auth?: boolean;
}
const SidebarItem = ({
	href,
	label,
	icon: Icon,
	onClick,
	auth,
}: SidebarItemProps) => {
	const router = useRouter();
	const { data: currentUser } = useCurrentUser();
	const loginModal = useLoginModal();

	const handleClick = useCallback(() => {
		if (onClick) {
			return onClick();
		}
		if (auth && !currentUser) {
			loginModal.onOpen();
		} else if (href) {
			router.push(href);
		}
	}, [router, onClick, href, loginModal, currentUser, auth]);
	return (
		<div onClick={handleClick} className=" flex flex-row items-center">
			{/* MOBILE DEVICE */}
			<div className=" relative rounded-full h-14 w-14 flex items-center justify-center p-4 hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer lg:hidden">
				<Icon size={28} color="white" />
			</div>
			{/* DESKTOP DEVICE */}
			<div className="relative hidden lg:flex items-center gap-4 p-4  rounded-full hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer">
				<Icon size={28} color="white" />
				<p className="hidden lg:block text-white text-xl">{label}</p>
			</div>
		</div>
	);
};

export default SidebarItem;
