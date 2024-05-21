"use client";

import { comment } from "postcss";
import CommentItem from "./CommentItem";
import Header from "../Header";

interface CommentFeedProps {
	comments?: Record<string, any>[];
}
const CommentFeed = ({ comments }: CommentFeedProps) => {
	return (
		<>
			<div className=" pb-2 flex text-white font-bold text-2xl items-center justify-center ">
				Tweet Reply
			</div>

			{comments?.map((comment) => (
				<CommentItem key={comment.id} data={comment} />
			))}
		</>
	);
};

export default CommentFeed;
