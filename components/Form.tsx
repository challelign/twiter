"use client";
import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import usePost from "@/hooks/usePost";
import usePosts from "@/hooks/usePosts";
import useRegisterModal from "@/hooks/useRegisterModal";
import axios from "axios";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import Button from "./Button";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import Loading from "./skeleton/Loading";
interface FormProps {
	placeholder: string;
	isComment?: boolean;
	postId?: string;
}

const Form = ({ placeholder, isComment, postId }: FormProps) => {
	const registerModal = useRegisterModal();
	const loginModal = useLoginModal();
	const { data: currentUser, isLoading: checkUserLogin } = useCurrentUser();
	const { mutate: mutatePosts } = usePosts();
	const { mutate: mutatePost } = usePost(postId as string);
	const [body, setBody] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [bodyImage, setBodyImage] = useState<string | null>(null);

	const handleBodyImageChange = (url: string) => {
		setBodyImage(url);
	};
	const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true);
			const url = isComment ? `/api/comments/?postId=${postId}` : "/api/posts";
			await axios.post(url, {
				body: body,
				bodyImage: bodyImage || undefined,
			});
			toast.success("Tweet created");
			setBody("");
			setBodyImage(null);
			setBodyImage("");
			mutatePosts();
			mutatePost();
		} catch (error: any) {
			console.log("POST_CREATE_ERROR", error);
			toast.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [body, bodyImage, mutatePosts, isComment, postId, mutatePost]);
	if (checkUserLogin) {
		return <Loading />;
	}
	return (
		<div className="border-b-[1px] border-neutral-800 px-5 py-2">
			{currentUser ? (
				<div className="flex flex-row gap-4">
					<div>
						<Avatar userId={currentUser?.id} />
					</div>
					<div className="w-full">
						<textarea
							disabled={isLoading}
							onChange={(event) => setBody(event.target.value)}
							value={body}
							className="
                                disabled:opacity-80
                                peer
                                resize-none 
                                mt-3 
                                w-full 
                                bg-black 
                                ring-0 
                                outline-none 
                                text-[20px] 
                                placeholder-neutral-500 
                                text-white
                            "
							placeholder={placeholder}
						></textarea>

						{!isComment && (
							<>
								<CloudinaryUploadWidget
									onUpload={handleBodyImageChange}
									widgetId="upload_widget_post"
								/>

								{bodyImage && (
									<div>
										<h2>Upload post image</h2>
										<img src={bodyImage} alt="Uploaded" />
									</div>
								)}
							</>
						)}

						<hr
							className="  opacity-0 
                                peer-focus:opacity-100 
                                h-[1px] 
                                w-full 
                                border-neutral-800 
                                transition"
						/>
						<div className="mt-4 flex flex-row justify-end">
							<Button
								disabled={isLoading || (!body && !bodyImage)}
								onClick={onSubmit}
								label="Tweet"
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="py-8">
					<h1 className="text-white text-2xl text-center mb-4 font-bold">
						Welcome to Twitter
					</h1>
					<div className="flex flex-row items-center justify-center gap-4">
						<Button label="Login" onClick={loginModal.onOpen} />
						<Button label="Register" onClick={registerModal.onOpen} secondary />
					</div>
				</div>
			)}
		</div>
	);
};

export default Form;
