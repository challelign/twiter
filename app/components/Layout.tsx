"use client";

import FollowBar from "./layout/FollowBar";
import Sidebar from "./layout/Sidebar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="h-screen bg-black">
			<div className="container h-full   mx-auto xl:px-32 max:w-6xl">
				<div className="grid grid-cols-4 h-full ">
					<Sidebar />

					{/* <div
							className="col-span-3 lg:col-span-2 border-x-[1px]
                    border-neutral-800 custom-scrollbar overflow-y-auto
                        "
						>
							{children}
						</div> */}

					<ScrollArea
						className="whitespace-nowrap rounded-sm border   col-span-3 lg:col-span-2 border-x-[1px]
                    border-neutral-800 pb-4"
					>
						{children}
					</ScrollArea>

					<FollowBar />
				</div>
			</div>
		</div>
	);
}
