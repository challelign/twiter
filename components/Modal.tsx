"use client";
import { useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Button from "./Button";

interface ModalProps {
	isOpen?: boolean;
	onClose: () => void;
	onSubmit: () => void;
	title?: string;
	body?: React.ReactElement;
	footer?: React.ReactElement;
	actionLabel: string;
	disabled?: boolean;
}
const Modal = ({
	isOpen,
	onClose,
	onSubmit,
	title,
	body,
	footer,
	actionLabel,
	disabled,
}: ModalProps) => {
	const handleClose = useCallback(() => {
		if (disabled) {
			return;
		}
		onClose();
	}, [disabled, onClose]);

	const handleSubmit = useCallback(() => {
		if (disabled) {
			return;
		}
		onSubmit();
	}, [disabled, onSubmit]);

	if (!isOpen) {
		return null;
	}
	return (
		<>
			<div
				className="justify-center 
          items-center 
          flex 
          overflow-x-hidden 
          overflow-y-auto 
		  custom-scrollbar
          fixed 
          inset-0 
          z-50 
          outline-none 
          focus:outline-none
          bg-neutral-800
          bg-opacity-70"
			>
				<div className="relative w-full lg:w-2/6 my-4 mx-auto lg:max-w-3xl h-full  ">
					{/* content to the above and below div  i remove lg:h-auto */}
					<div
						className=" h-full
                            
                            border-0 
                            rounded-lg 
                            shadow-lg 
                            relative 
                            flex 
                            flex-col 
                            w-full 
                            bg-black 
                            outline-none 
                            focus:outline-none
            "
					>
						{/* Header */}
						<div
							className=" flex 
                                items-center 
                                justify-between 
                                p-7 
                                rounded-t
                                "
						>
							<h3 className="text-3xl font-semibold text-white">{title}</h3>
							<button
								onClick={handleClose}
								className="p-1 ml-auto border-0 text-white hover:opacity-70 transition"
							>
								<AiOutlineClose size={20} />
							</button>
						</div>
						{/* Body */}
						<div className="relative p-7 flex-auto overflow-y-auto">{body}</div>
						{/* Footer */}
						<div className="  gap-2 p-7  ">
							<div className="flex gap-3">
								<Button
									disabled={disabled}
									label={actionLabel}
									secondary
									fullWidth
									large
									onClick={handleSubmit}
								/>

								<button
									onClick={handleClose}
									className="rounded-full font-semibold hover:opacity-80 transition border-2 flex items-center justify-center  gap-2 p-2 ml-auto   text-white "
								>
									Cancel
									<AiOutlineClose size={20} />
								</button>
							</div>
							{footer}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Modal;
