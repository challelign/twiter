"use client";

import FollowBar from "./layout/FollowBar";
import Sidebar from "./layout/Sidebar";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="h-screen bg-black">
			<div className="container h-full mx-auto xl:px-32 max:w-6xl">
				<div className="grid grid-cols-4 h-full">
					<Sidebar />
					<div
						className="col-span-3 lg:col-span-2 border-x-[1px]
                    border-neutral-800
                        "
					>
						{children}
						<p className="text-white">cha</p>
					</div>
					<FollowBar />
				</div>
			</div>
		</div>
	);
}
