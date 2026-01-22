import { create } from "zustand";

type LeadCaptureModalState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useLeadCaptureModal = create<LeadCaptureModalState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
