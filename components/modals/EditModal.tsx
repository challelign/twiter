"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from "@/hooks/useEditModal";
import useUser from "@/hooks/useUser";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CloudinaryUploadWidget from "../CloudinaryUploadWidget";
import Input from "../Input";
import Modal from "../Modal";

const EditModal = () => {
	const { data: currentUser, mutate: mutateFetchedCurrentUser } =
		useCurrentUser();
	const { mutate: mutateFetchedUser } = useUser(currentUser?.id);
	const editModal = useEditModal();

	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [coverImage, setCoverImage] = useState<string | null>(null);

	// end to see image preview only
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setProfileImage(currentUser?.profileImage);
		setCoverImage(currentUser?.coverImage);
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
	const handleUploadCover = (url: string) => {
		setCoverImage(url);
	};
	const handleUploadProfile = (url: string) => {
		setProfileImage(url);
	};
	console.log(currentUser);
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

			{/* <CloudinaryUploadWidget onUpload={handleUploadCover} />
			 */}

			<CloudinaryUploadWidget
				onUpload={handleUploadCover}
				widgetId="upload_widget_cover"
			/>
			{coverImage ? (
				<div>
					<h2>Upload profile image</h2>
					<img src={coverImage} alt="Uploaded" />
				</div>
			) : (
				<>
					{currentUser?.coverImage && (
						<>
							<p className="text-white"> Current Cover image </p>
							<img src={currentUser?.coverImage} alt={currentUser?.name} />
						</>
					)}
				</>
			)}
			<p className="text-white font-semibold text-xl">Upload profile image</p>

			{/* <CloudinaryUploadWidget onUpload={handleUploadProfile} /> */}

			<CloudinaryUploadWidget
				onUpload={handleUploadProfile}
				widgetId="upload_widget_profile"
			/>

			{profileImage ? (
				<div>
					<h2>Upload profile image</h2>
					<img src={profileImage} alt="Uploaded" />
				</div>
			) : (
				<>
					{currentUser?.profileImage && (
						<>
							<p className="text-white"> Current Profile image </p>
							<img src={currentUser?.profileImage} alt={currentUser?.name} />
						</>
					)}
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
