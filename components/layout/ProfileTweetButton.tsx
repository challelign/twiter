"use client";
import useCurrentUser from "@/hooks/useCurrentUser";

import Avatar from "../Avatar";

const ProfileTweetButton = () => {
	const { data: currentUser } = useCurrentUser();

	return (
		<>
			{currentUser && currentUser?.id && (
				<div className="space-y-2 lg:w-[230px]">
					<div className=" hidden lg:flex   flex-col gap-6 mt-6 p-2  rounded-full items-center justify-center bg-slate-600  hover:bg-sky-500 hover:bg-opacity-80 transition cursor-pointer">
						<div className="flex flex-row gap-6">
							<Avatar userId={currentUser?.id} />
							<div className="flex flex-col">
								<p className="text-white font-semibold text-sm">
									{currentUser?.name}
								</p>
								<p className="text-neutral-400 text-sm">
									@{currentUser?.username}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProfileTweetButton;
