"use client";
import React, { useEffect } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
	interface Window {
		cloudinary: any;
	}
}

interface CloudinaryUploadWidgetProps {
	onUpload: (url: string) => void;
	widgetId: string;
}

const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
	onUpload,
	widgetId,
}) => {
	useEffect(() => {
		const cloudName = "melodie"; // replace with your Cloudinary cloud name
		const uploadPreset = "twiteervxe9bqyl"; // replace with your upload preset

		const myWidget = window.cloudinary.createUploadWidget(
			{
				cloudName: cloudName,
				uploadPreset: uploadPreset,
				// sources: ["local", "url", "camera"],
				multiple: false,
				defaultSource: "local",
				maxFiles: 1,
			},
			(error: any, result: any) => {
				if (!error && result && result.event === "success") {
					console.log("Done! Here is the image info: ", result.info);
					onUpload(result.info.secure_url);
				}
			}
		);

		document.getElementById(widgetId)?.addEventListener(
			"click",
			function () {
				myWidget.open();
			},
			false
		);
	}, [onUpload, widgetId]);

	return (
		<button
			id={widgetId}
			className="  
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2 
              p-1
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-2
              text-neutral-600"
		>
			Upload Image
			<TbPhotoPlus size={20} />
		</button>
	);
};

export default CloudinaryUploadWidget;
