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
	const { data: currentUser } = useCurrentUser();
	const { mutate: mutateFetchedUser } = useUser(currentUser?.id);
	const editModal = useEditModal();

	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [coverImage, setCoverImage] = useState<string | null>(null);
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [error, setError] = useState<string | null>(null);

	console.log(profileImage);
	// const handleImageChange = async (
	// 	e: React.ChangeEvent<HTMLInputElement>,
	// 	setImage: (value: string | null) => void
	// ) => {
	// 	if (e.target.files && e.target.files[0]) {
	// 		const file = e.target.files[0];
	// 		const reader = new FileReader();
	// 		reader.onloadend = () => {
	// 			setImage(reader.result as string);
	// 		};
	// 		reader.readAsDataURL(file);
	// 	}
	// };
	const handleImageChange = useCallback(
		async (
			e: ChangeEvent<HTMLInputElement>,
			setImage: (value: string | null) => void
		) => {
			if (e.target.files && e.target.files[0]) {
				const file = e.target.files[0];

				const reader = new FileReader();
				reader.onloadend = () => {
					setImage(reader.result as string);
				};
				reader.readAsDataURL(file);
				// const url = URL.createObjectURL(file);
				// setImage(url);
			}
		},
		[]
	);
	const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleImageChange(e, setCoverImage);
	};

	const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleImageChange(e, setProfileImage);
	};

	useEffect(() => {
		setProfileImage(currentUser?.profileImage || null);
		setCoverImage(currentUser?.coverImage || null);
		setName(currentUser?.name || "");
		setUsername(currentUser?.username || "");
		setBio(currentUser?.bio || "");
	}, [currentUser]);
	console.log(profileImage);

	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			let pImage = null;
			if (profileImage === currentUser.profileImage) {
				alert("profileImage" + profileImage);
				return;
			}
			if (coverImage) {
				alert("coverImage" + coverImage);
				return;
			}
			if (!name || !username) {
				return setError("All the fields are required");
			}

			await axios.patch("/api/users", {
				name,
				username,
				bio,
				profileImage,
				coverImage,
			});

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
				<Image
					src={`/userProfile/${coverImage}` || coverImage}
					alt="cover Image"
					height={400}
					width={400}
					layout="fixed"
				/>
			)}
			<p className="text-white font-semibold text-xl">Upload profile image</p>
			<Input
				placeholder="Upload profile image"
				onChange={handleProfileImageChange}
				type="file"
				disabled={isLoading}
			/>
			{profileImage != null && (
				<Image
					src={`/userProfile/${profileImage}` || profileImage}
					height={400}
					width={400}
					alt="Product Image"
				/>
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
