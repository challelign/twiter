"use client";
import ContentLoader from "react-content-loader";

const SinglePostLoader = () => {
	return (
		<ContentLoader viewBox="0 0 400 160" height={160} width={400}>
			<rect
				x="110"
				y="21"
				rx="4"
				ry="4"
				width="254"
				height="6"
				fill="#cccccca6"
			/>
			<rect
				x="111"
				y="41"
				rx="3"
				ry="3"
				width="185"
				height="7"
				fill="#cccccca6"
			/>
			<rect
				x="304"
				y="-46"
				rx="3"
				ry="3"
				width="350"
				height="6"
				fill="#cccccca6"
			/>
			<rect
				x="371"
				y="-45"
				rx="3"
				ry="3"
				width="380"
				height="6"
				fill="#cccccca6"
			/>
			<rect
				x="484"
				y="-45"
				rx="3"
				ry="3"
				width="201"
				height="6"
				fill="#cccccca6"
			/>
			<circle cx="48" cy="48" r="48" />
		</ContentLoader>
	);
};

export default SinglePostLoader;
