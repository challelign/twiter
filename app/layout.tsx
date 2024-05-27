import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "./components/Layout";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";

const inter = Inter({ subsets: ["latin"] });
import { ToastProvider } from "./components/providers/toast-provider";
import EditModal from "./components/modals/EditModal";
export const metadata: Metadata = {
	title: "Create tweet",
	description: "Twitter by create Challelign Tilahun",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<html lang="en">
				{/* <Modal isOpen title="Test Modal" actionLabel="Submit" /> */}

				<body className={inter.className}>
					<ToastProvider />
					<EditModal />
					<LoginModal />
					<RegisterModal />
					<Layout>{children}</Layout>
				</body>
			</html>
		</>
	);
}
