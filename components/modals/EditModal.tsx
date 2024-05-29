"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from "@/hooks/useEditModal";
import useUser from "@/hooks/useUser";
import axios from "axios";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Input from "../Input";
import Modal from "../Modal";
import Image from "next/image";

const EditModal = () => {
	const { data: currentUser, mutate: mutateFetchedCurrentUser } =
		useCurrentUser();
	const { mutate: mutateFetchedUser } = useUser(currentUser?.id);
	const editModal = useEditModal();

	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [coverImage, setCoverImage] = useState<string | null>(null);

	// start to see image preview only
	const [profileImageURL, setProfileImageURL] = useState<string | null>(null);
	const [coverImageURL, setCoverImageURL] = useState<string | null>(null);
	// end to see image preview only
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];

			const reader = new FileReader();
			reader.onloadend = () => {
				setCoverImage(reader.result as string);
				setCoverImageURL(URL.createObjectURL(file));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];

			const reader = new FileReader();
			reader.onloadend = () => {
				setProfileImage(reader.result as string);
				setProfileImageURL(URL.createObjectURL(file));
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		// setProfileImage(currentUser?.profileImage);
		// setCoverImage(currentUser?.coverImage);
		setName(currentUser?.name);
		setUsername(currentUser?.username);
		setBio(currentUser?.bio);
	}, [
		currentUser?.name,
		currentUser?.username,
		currentUser?.bio,
		currentUser?.profileImage,
		currentUser?.coverImage,
	]);

	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			await axios.patch("/api/users", {
				name,
				username,
				bio,
				profileImage: profileImage || undefined, // Make these fields optional
				coverImage: coverImage || undefined,
			});
			mutateFetchedUser();
			mutateFetchedCurrentUser();
			toast.success("Profile updated");
			editModal.onClose();
		} catch (error: any) {
			console.log("EDIT_MODAL_ERROR", error);
			if (
				error.response?.status === 403 ||
				error.response?.status === 400 ||
				error.response?.status === 404
			) {
				toast.error(error.response.data);
			} else {
				toast.error("Something went wrong");
			}
		} finally {
			setIsLoading(false);
		}
	}, [
		editModal,
		name,
		username,
		bio,
		mutateFetchedUser,
		mutateFetchedCurrentUser,
		profileImage,
		coverImage,
	]);

	const bodyContent = (
		<div className="flex flex-col gap-4">
			<p className="text-white font-semibold text-xl">Upload cover image</p>

			<Input
				placeholder="Upload cover image"
				onChange={handleCoverImageChange}
				type="file"
				disabled={isLoading}
			/>

			{coverImage && (
				<>
					{/* <Image
						src={`/userProfile/${currentUser?.coverImage}`}
						alt="cover Image"
						height={400}
						width={400}
						layout="fixed"
					/> */}

					<Image
						src={coverImageURL!}
						height={400}
						width={400}
						alt="Product Image"
					/>
				</>
			)}
			<p className="text-white font-semibold text-xl">Upload profile image</p>
			<Input
				placeholder="Upload profile image"
				onChange={handleProfileImageChange}
				type="file"
				disabled={isLoading}
			/>
			{profileImage != null && (
				<>
					{/* <Image
						src={`/userProfile/${currentUser?.profileImage}` || profileImage}
						height={400}
						width={400}
						alt="Product Image"
					/> */}

					<Image
						src={profileImageURL!}
						height={400}
						width={400}
						alt="Product Image"
					/>
				</>
			)}

			<Input
				placeholder="Username"
				onChange={(e) => setUsername(e.target.value)}
				value={username}
				disabled={isLoading}
			/>
			<Input
				placeholder="Bio"
				onChange={(e) => setBio(e.target.value)}
				value={bio}
				disabled={isLoading}
			/>
			{error && (
				<div className="text-red-500 items-center justify-center text-center mb-4 border-2 h-10 pt-1 font-semibold">
					{error}
				</div>
			)}
		</div>
	);

	return (
		<Modal
			disabled={isLoading}
			isOpen={editModal.isOpen}
			title="Edit your profile"
			actionLabel="Save"
			onClose={editModal.onClose}
			onSubmit={onSubmit}
			body={bodyContent}
		/>
	);
};

export default EditModal;
