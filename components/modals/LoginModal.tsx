"use client";
import useLoginModal from "@/hooks/useLoginModal";
import { useCallback, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import useRegisterModal from "@/hooks/useRegisterModal";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const LoginModal = () => {
	const loginModal = useLoginModal();
	const registerModal = useRegisterModal();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onToggle = useCallback(() => {
		if (isLoading) {
			return;
		}

		loginModal.onClose();
		registerModal.onOpen();
	}, [loginModal, registerModal]);

	const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			if (!email || !password) {
				return setError("Please enter username and password");
			}
			const signInResult = await signIn("credentials", {
				email,
				password,
				callbackUrl: `${window.location.origin}`,
				redirect: false,
			});
			if (!signInResult?.ok) {
				return toast.error("Something went wrong, Invalid credentials");
			}
			toast.success("Login successful");

			loginModal.onClose();
		} catch (error) {
			console.log("LOGIN_ERROR", error);
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}, [email, password, loginModal, error]);
	const bodyContent = (
		<div className="flex flex-col gap-4">
			<Input
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
				type="email"
				value={email}
				disabled={isLoading}
			/>
			<Input
				placeholder="Password"
				type="password"
				onChange={(e) => setPassword(e.target.value)}
				value={password}
				disabled={isLoading}
			/>
			{error && (
				<div className="text-red-500 items-center justify-center text-center mb-4 border-2 h-10 pt-1 font-semibold ">
					{error}
				</div>
			)}
		</div>
	);
	const footerContent = (
		<div className="text-neutral-400 text-center  mt-4">
			<p>
				First time using Twitter?
				<span
					onClick={onToggle}
					className="
            text-white 
            cursor-pointer 
            hover:underline
          "
				>
					{" "}
					Create an account
				</span>
			</p>
		</div>
	);
	return (
		<Modal
			disabled={isLoading}
			isOpen={loginModal.isOpen}
			title="Login"
			actionLabel="Sign in"
			onClose={loginModal.onClose}
			onSubmit={onSubmit}
			body={bodyContent}
			footer={footerContent}
		/>
	);
};

export default LoginModal;
