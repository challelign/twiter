import Image from "next/image";
import Header from "./components/Header";
import Form from "./components/Form";
import PostFeed from "./components/posts/PostFeed";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "Twitter App",
	description: "Twitter by create Challelign Tilahun",
	openGraph: {
		title: "Twitter App",
		description: "Twitter by create Challelign Tilahun",
		url: "https://cha-profile.vercel.app/",
		siteName: "chaprofile",
		images: [
			{
				url: "https://mychaprofile.png",
				width: "1260",
				height: "800",
			},
			{
				url: "https://mychaprofile2.png",
				width: "1260",
				height: "800",
			},
		],
	},
};
export default function Home() {
	return (
		<>
			<Header label="Home" />
			<Form placeholder="What's happening?" />
			<PostFeed />
		</>
	);
}
