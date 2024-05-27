"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import useNotifications from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { BsTwitter } from "react-icons/bs";

const NotificationsFeed = () => {
	const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
	const { data: fetchedNotifications = [], mutate: mutateNotifications } =
		useNotifications(currentUser?.id);

	const router = useRouter();

	console.log(fetchedNotifications);

	const goToUser = useCallback(
		async (id: string, ev: any) => {
			ev.stopPropagation();
			router.push(`/users/${id}`);
		},
		[router, mutateCurrentUser]
	);
	useEffect(() => {
		mutateCurrentUser();
		mutateNotifications();
	}, [mutateCurrentUser]);

	if (fetchedNotifications.length === 0) {
		return (
			<div className="text-neutral-600 text-center p-6 text-xl">
				No notifications
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			{fetchedNotifications.map((notification: Record<string, any>) => (
				<div className="flex flex-row items-center p-6 gap-4 border-b-[1px] border-neutral-800">
					<BsTwitter size={32} color="white" />
					<p
						onClick={() => goToUser(notification.user.id, event)}
						className="text-white  hover:opacity-90 
        							transition 
        							cursor-pointer"
					>
						{notification.body} @{notification.user.name}@
					</p>
				</div>
			))}
		</div>
	);
};

export default NotificationsFeed;
