import useSWR from "swr";

import fetcher from "@/libs/fetcher";

const useUser = (userId: string) => {
	const { data, error, isLoading, mutate } = useSWR(
		userId ? `/api/users/${userId}` : null,
		fetcher,
		{
			// These options can be adjusted based on your needs
			// revalidateOnFocus: true, // Revalidate when window gets focus
			// revalidateOnReconnect: true, // Revalidate when network reconnects
			refreshInterval: 1000, // Revalidate every 1 seconds
		}
	);

	return {
		data,
		error,
		isLoading,
		mutate,
	};
};

export default useUser;
