import useSWR from "swr";

import fetcher from "@/libs/fetcher";

const useNotifications = (userId?: string) => {
	const url = userId ? `/api/notifications/${userId}` : null;
	const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
		revalidateOnFocus: true, // Revalidate when window gets focus
		revalidateOnReconnect: true, // Revalidate when network reconnects
		refreshInterval: 5000, // Revalidate every 1 seconds
	});

	return {
		data,
		error,
		isLoading,
		mutate,
	};
};

export default useNotifications;
