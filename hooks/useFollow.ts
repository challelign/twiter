import useSWR from "swr";

import fetcher from "@/libs/fetcher";
import useCurrentUser from "./useCurrentUser";
import useUser from "./useUser";
import useLoginModal from "./useLoginModal";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const useFollow = (userId: string) => {
	const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
	const { mutate: mutateFetcherUser } = useUser(userId);
	const loginModal = useLoginModal();

	const isFollowing = useMemo(() => {
		const list = currentUser?.followingIds || [];
		return list.includes(userId);
	}, [userId, currentUser?.followingIds]);

	const toggleFollow = useCallback(async () => {
		if (!currentUser) {
			return loginModal.onOpen();
		}
		try {
			let request;
			if (isFollowing) {
				request = () => axios.delete("/api/follow", { data: { userId } });
			} else {
				request = () => axios.post("/api/follow", { userId });
			}
			await request();
			mutateCurrentUser();
			mutateFetcherUser();
			toast.success("Success");
		} catch (error) {
			console.log("USE_FOLLOWING", error);
			toast.error("something went wrong");
		}
	}, [
		mutateCurrentUser,
		mutateFetcherUser,
		currentUser,
		userId,
		isFollowing,
		loginModal,
	]);

	return { isFollowing, toggleFollow };
};

export default useFollow;
