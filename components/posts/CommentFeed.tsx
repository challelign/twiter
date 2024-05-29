"use client";

import CommentItem from "./CommentItem";

interface CommentFeedProps {
	comments?: Record<string, any>[];
}
const CommentFeed = ({ comments }: CommentFeedProps) => {
	return (
		<>
			{comments?.length === 0 ? (
				<>
					<div className=" pb-2 pt-4 flex text-white font-bold text-2xl items-center justify-center text-center ">
						No Tweet Reply
					</div>
				</>
			) : (
				<div className="pb-2 pt-4 flex text-white font-bold text-2xl items-center justify-center text-center">
					Tweet Reply
				</div>
			)}

			{comments?.map((comment) => (
				<CommentItem key={comment.id} data={comment} />
			))}
		</>
	);
};

export default CommentFeed;
