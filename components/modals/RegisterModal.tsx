"use client";
import { useCallback, useState } from "react";
import Input from "../Input";
import Modal from "../Modal";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import validateEmail from "@/libs/validateEmail";
import ImageUpload from "../ImageUpload";

const RegisterModal = () => {
	const loginModal = useLoginModal();
	const registerModal = useRegisterModal();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onToggle = useCallback(() => {
		if (isLoading) {
			return;
		}

		registerModal.onClose();
		loginModal.onOpen();
	}, [loginModal, registerModal, isLoading, email, password, username, name]);

	const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			if (!validateEmail(email)) {
				return setError("Invalid email format");
			}
			if (!email || !name || !password || !username) {
				return setError("All the fields are required");
			}

			const user = await axios.post("/api/users", {
				email,
				password,
				username,
				name,
			});
			toast.success("Account created");
			signIn("credentials", {
				email,
				password,
			});
			console.log("RegisteredData", user);
			// registerModal.onClose();
		} catch (error: any) {
			console.log("REGISTER_ERROR", error);
			console.log("REGISTER_ERROR", error.response.data);
			if (error.response.status === 403) {
				// toast.error("User exist try different email");
				toast.error(error.response.data);
			} else if (error.response.status === 400) {
				toast.error(error.response.data);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setIsLoading(false);
		}
	}, [email, password, registerModal, username, name]);

	const bodyContent = (
		<div className="flex flex-col gap-4">
			<Input
				disabled={isLoading}
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<Input
				disabled={isLoading}
				placeholder="Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<Input
				disabled={isLoading}
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<Input
				disabled={isLoading}
				placeholder="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			{error && (
				<div className="text-red-500 items-center justify-center text-center mb-4 border-2 h-10 pt-1 font-semibold ">
					{error}
				</div>
			)}
		</div>
	);

	const footerContent = (
		<div className="text-neutral-400 text-center mt-4">
			<p>
				Already have an account?
				<span
					onClick={onToggle}
					className="
            text-white 
            cursor-pointer 
            hover:underline
          "
				>
					{" "}
					Sign in
				</span>
			</p>
		</div>
	);

	return (
		<Modal
			disabled={isLoading}
			isOpen={registerModal.isOpen}
			title="Create an account"
			actionLabel="Register"
			onClose={registerModal.onClose}
			onSubmit={onSubmit}
			body={bodyContent}
			footer={footerContent}
		/>
	);
};

export default RegisterModal;
