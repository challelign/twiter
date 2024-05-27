import useSWR from "swr";

import fetcher from "@/libs/fetcher";

const useUsers = () => {
	const { data, error, isLoading, mutate } = useSWR("/api/users/", fetcher, {
		// These options can be adjusted based on your needs
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

export default useUsers;
