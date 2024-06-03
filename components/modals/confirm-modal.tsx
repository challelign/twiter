"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface ConfirmModalProps {
	children: React.ReactNode;
	onConfirm: () => void;
	dataModal: Record<string, any>;
}

export const ConfirmModal = ({
	children,
	onConfirm,
	dataModal,
}: ConfirmModalProps) => {
	console.log(dataModal);
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						You want to delete Post of ` {dataModal?.user?.name}` Are you sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.
					</AlertDialogDescription>
					<ScrollArea className="h-[250px] w-[400px] rounded-md border p-4">
						<AlertDialogDescription>
							<Separator />

							<div className="text-black text-xl font-semibold mt-1 text-wrap">
								{dataModal?.body}
							</div>
							{dataModal?.image && (
								<div className="text-white mt-1 ">
									<Image
										src={`${dataModal?.image}`}
										alt={dataModal?.user.name}
										height={250}
										width={400}
										objectFit=""
									/>
								</div>
							)}
						</AlertDialogDescription>
					</ScrollArea>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
