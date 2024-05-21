import { create } from "zustand";

interface UseEditModalStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const useEditModal = create<UseEditModalStore>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

export default useEditModal;
