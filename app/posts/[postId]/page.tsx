"use client";
import Form from "@/app/components/Form";
import Header from "@/app/components/Header";
import CommentFeed from "@/app/components/posts/CommentFeed";
import PostItem from "@/app/components/posts/PostItem";
import SinglePostLoader from "@/app/components/skeleton/SinglePostLoader";
import usePost from "@/hooks/usePost";
import { useRouter } from "next/navigation";
import React from "react";
import { ClipLoader } from "react-spinners";

const postsPage = ({ params }: { params: { postId: string } }) => {
	const router = useRouter();
	const postId = params.postId;

	const { data: fetchedPost, isLoading } = usePost(postId as string);
	console.log(fetchedPost);
	if (isLoading || !fetchedPost) {
		return (
			<div className="flex justify-center  py-10 h-full">
				<SinglePostLoader />
			</div>
		);
	}
	return (
		<>
			<Header label="Tweet" showBackArrow />
			<PostItem data={fetchedPost} />
			<Form
				postId={postId as string}
				isComment
				placeholder="Tweet your reply"
			/>
			<CommentFeed comments={fetchedPost?.comments} />
		</>
	);
};

export default postsPage;
