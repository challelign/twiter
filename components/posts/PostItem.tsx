"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLike from "@/hooks/useLike";
import useLoginModal from "@/hooks/useLoginModal";
import usePost from "@/hooks/usePost";
import usePosts from "@/hooks/usePosts";
import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import { Delete, MoreHorizontal, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from "react-icons/ai";
import Avatar from "../Avatar";
import { ConfirmModal } from "../modals/confirm-modal";
import { Button } from "../ui/button";
interface PostItemProps {
	data: Record<string, any>;
	userId?: string;
	comments?: Record<string, any>[];
}

const PostItem = ({ data, userId, comments }: PostItemProps) => {
	const router = useRouter();
	const loginModal = useLoginModal();
	const [isLoading, setIsLoading] = useState(false);

	const { data: currentUser } = useCurrentUser();
	const { hasLiked, toggleLike } = useLike({ postId: data.id, userId });
	const { data: fetchedPost } = usePost(data?.id as string);
	const { mutate: mutatePosts } = usePosts();
	const { mutate: mutatePost } = usePost(data?.id);
	const goToUser = useCallback(
		(ev: any) => {
			ev.stopPropagation();
			router.push(`/users/${data.user.id}`);
		},
		[router, data.user.id]
	);

	const goToPost = useCallback(() => {
		router.push(`/posts/${data.id}`);
	}, [router, data.id]);

	const onLike = useCallback(
		async (ev: any) => {
			ev.stopPropagation();

			if (!currentUser) {
				return loginModal.onOpen();
			}
			toggleLike();
		},
		[loginModal, currentUser, toggleLike]
	);

	const createdAt = useMemo(() => {
		if (!data?.createdAt) {
			return null;
		}

		return formatDistanceToNowStrict(new Date(data.createdAt));
	}, [data.createdAt]);

	const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;

	const handleDelete = useCallback(async () => {
		try {
			setIsLoading(true);
			const url = `/api/posts/${data.id}`;
			await axios.delete(url);
			toast.success("Tweet deleted");

			mutatePosts();
			mutatePost();
			router.push("/", { scroll: false });
		} catch (error) {
			console.log("POST_DELETE_ERROR", error);
			toast.error("something went wrong");
		} finally {
			setIsLoading(false);
		}
	}, [mutatePosts, data?.id, mutatePost, router]);

	const handleEdit = useCallback(() => {
		router.push(`/posts/${data.id}`);
	}, [router, data.id]);

	return (
		<div
			// onClick={goToPost}
			className="
        border-b-[1px] 
        border-neutral-800 
        p-5 
        cursor-pointer 
        hover:bg-neutral-900 
        transition
      "
		>
			<div className="flex flex-row items-start gap-3">
				<div>
					<Avatar userId={data.user.id} />
				</div>
				<div>
					<div className="flex flex-row items-center gap-2">
						<p
							onClick={goToUser}
							className="
                text-white 
                font-semibold 
                cursor-pointer 
                hover:underline
            "
						>
							{data.user.name}
						</p>
						<span
							onClick={goToUser}
							className="
                text-neutral-500
                cursor-pointer
                hover:underline
                hidden
                md:block
            "
						>
							@{data.user.username}
						</span>

						<span className="text-neutral-500 text-sm">{createdAt}</span>
						<span className="text-sm text-white gap-x-10 ml-20 pl-20   cursor-pointer">
							{/* <DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className="bg-black  hover:bg-neutral-900 " size="sm">
										<HiOutlineDotsHorizontal className="h-10 w-10 text-white" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="">
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem onClick={handleEdit}>
											<Edit className="mr-2 h-4 w-4" />
											<span>Edit</span>
										</DropdownMenuItem>

										<ConfirmModal onConfirm={handleDelete} dataModal={data}>
											<button className="flex items-center justify-center font-semibold ">
												<Delete className="mr-2 h-4 w-4 " />
												<span>Delete</span>
											</button>
										</ConfirmModal>

										<DropdownMenuItem>
											<FaRegCopy className="mr-2 h-4 w-4" />
											<span>Copy link </span>
										</DropdownMenuItem>
										<DropdownMenuItem>
											<BiRepost className="mr-2 h-4 w-4" />
											<span>Repost </span>
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
								</DropdownMenuContent>
							</DropdownMenu> */}

							{currentUser?.id === data?.user?.id && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" className="h-4 w-8 p-0">
											<span className="sr-only">Open menu</span>
											<MoreHorizontal className="h-4 w-8" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<Link href={`/posts/${data.id}`}>
											<DropdownMenuItem>
												<Pencil className=" h-4 w-4 mr-2" />
												Edit
											</DropdownMenuItem>
										</Link>

										<ConfirmModal onConfirm={handleDelete} dataModal={data}>
											<button className="flex items-center justify-center gap-x-2 ">
												<Delete className=" h-4 w-4 mr-2 gap-x-2" /> Delete
											</button>
										</ConfirmModal>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</span>
					</div>
					<HoverCard>
						<HoverCardTrigger
							className="text-white mt-1 text-wrap hover:text-sky-500"
							onClick={goToPost}
						>
							{data?.body}
						</HoverCardTrigger>
						<HoverCardContent>Click to see details</HoverCardContent>
					</HoverCard>

					{/* <div className="text-white mt-1 text-wrap" onClick={goToPost}>
						{data?.body}
					</div> */}
					{data?.image && (
						<div className="text-white mt-1 " onClick={goToPost}>
							<Image
								src={`/postImage/${data?.image}`}
								alt={data?.user.name}
								height={250}
								width={400}
								objectFit=""
							/>
						</div>
					)}
					<div className="flex flex-row items-center mt-3 gap-10">
						{data?.comments?.length ? (
							<HoverCard>
								<HoverCardTrigger
									className=" flex 
									flex-row 
									items-center 
									text-neutral-500 
									gap-2 
									cursor-pointer 
									transition 
									hover:text-sky-500"
									onClick={goToPost}
								>
									<AiOutlineMessage size={20} />
									<p>{data?.comments?.length || 0}</p>
								</HoverCardTrigger>
								<HoverCardContent>
									{data?.comments?.map((comment: Record<string, any>) => (
										<div
											className="flex text-black text-nowrap"
											key={comment.id}
										>
											<p className="text-sm line-clamp-2 mb-2">
												<span className="font-semibold">
													{data?.user.name} retweet{" "}
												</span>
												{comment.body}
											</p>
										</div>
									))}
								</HoverCardContent>
							</HoverCard>
						) : (
							<>
								<div
									className="
								flex 
								flex-row 
								items-center 
								text-neutral-500 
								gap-2 
								cursor-pointer 
								transition 
								hover:text-sky-500
							"
								>
									<AiOutlineMessage size={20} />
									<p>{data.comments?.length || 0}</p>
								</div>
							</>
						)}

						<div
							onClick={onLike}
							className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition 
                hover:text-red-500
            "
						>
							<LikeIcon color={hasLiked ? "red" : ""} size={20} />
							<p>{data.likedIds?.length}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostItem;
