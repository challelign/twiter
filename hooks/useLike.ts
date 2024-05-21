import useSWR from "swr";

import fetcher from "@/libs/fetcher";
import useCurrentUser from "./useCurrentUser";
import useUser from "./useUser";
import useLoginModal from "./useLoginModal";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import usePost from "./usePost";
import usePosts from "./usePosts";

const useLike = ({ postId, userId }: { postId: string; userId?: string }) => {
	const { data: currentUser } = useCurrentUser();
	const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
	const { mutate: mutateFetcherPosts } = usePosts(userId);
	const loginModal = useLoginModal();

	const hasLiked = useMemo(() => {
		const list = fetchedPost?.likedIds || [];
		return list.includes(currentUser?.id);
	}, [fetchedPost, currentUser?.id]);

	const toggleLike = useCallback(async () => {
		if (!currentUser) {
			return loginModal.onOpen();
		}
		try {
			let request;
			if (hasLiked) {
				request = () => axios.delete("/api/like", { data: { postId } });
				toast.success("You dislike tweet👎 ");
			} else {
				request = () => axios.post("/api/like", { postId });
				toast.success("You Liked tweet 💗");
			}
			await request();
			mutateFetchedPost();
			mutateFetcherPosts();
		} catch (error) {
			console.log("USE_FOLLOWING", error);
			toast.error("something went wrong");
		}
	}, [
		mutateFetchedPost,
		mutateFetcherPosts,
		currentUser,
		postId,
		hasLiked,
		loginModal,
	]);

	return { hasLiked, toggleLike };
};

export default useLike;
