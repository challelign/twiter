import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Retweet  ",
	description: "Twitter by create Challelign Tilahun",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
