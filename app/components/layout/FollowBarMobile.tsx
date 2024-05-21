import useUser from "@/hooks/useUser";
import useUsers from "@/hooks/useUsers";
import Avatar from "../Avatar";

const FollowBarMobile = () => {
	const { data: users = [] } = useUsers();
	if (users.length === 0) {
		return null;
	}

	return (
		<div className="col-span-1 h-full pr-4 md:pr-6     pt-4">
			<div className="flex flex-col items-center">
				<div className="px-1 py-2 lg:hidden ">
					<div className="bg-neutral-800 rounded-xl p-2">
						<h2 className="text-white text-sm font-semibold items-center text-center">
							Who to follow
						</h2>
						<div className="flex flex-col gap-3 mt-4">
							{users.map((user: Record<string, any>) => (
								<div key={user.id} className="flex flex-col gap-2">
									<Avatar userId={user.id} />
									<div className="flex flex-col items-center text-center justify-center">
										<p className="text-white font-semibold text-sm">
											{user.name}
										</p>
										<p className="text-neutral-400 text-sm">@{user.username}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FollowBarMobile;
