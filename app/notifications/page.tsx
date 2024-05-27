"use server";
import { getServerSession } from "next-auth";
import Header from "../components/Header";
import { redirect } from "next/navigation";
import NotificationsFeed from "../components/NotificationsFeed";

const NotificationsPage = async () => {
	const session = await getServerSession();
	console.log("GET_SERVER_SESSION", session);
	if (!session) {
		return redirect("/");
	}
	return (
		<>
			<Header showBackArrow label="Notifications" />
			<NotificationsFeed />
		</>
	);
};

export default NotificationsPage;
