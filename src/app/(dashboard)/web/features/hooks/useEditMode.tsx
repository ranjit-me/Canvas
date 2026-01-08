"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { EditState } from '../../birthday/girlfriend/rose-birthday/types';

interface EditModeContextType {
    editState: EditState;
    selectElement: (elementId: string, type: 'text' | 'image' | 'date' | 'timeline') => void;
    deselectElement: () => void;
    isSelected: (elementId: string) => boolean;
    isEditMode: boolean;
    setEditMode: (value: boolean) => void;
    toggleEditMode: () => void;
    allowToggle: boolean;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children, forcedEditMode, allowToggle = true }: { children: ReactNode, forcedEditMode?: boolean, allowToggle?: boolean }) {
    // Global edit mode state - controls whether editing UI is shown
    const [isEditMode, setIsEditMode] = useState<boolean>(forcedEditMode !== undefined ? forcedEditMode : true);

    const [editState, setEditState] = useState<EditState>({
        isEditing: false,
        selectedElement: null,
        elementType: null,
    });

    const selectElement = (elementId: string, type: 'text' | 'image' | 'date' | 'timeline') => {
        setEditState({
            isEditing: true,
            selectedElement: elementId,
            elementType: type,
        });
    };

    const deselectElement = () => {
        setEditState({
            isEditing: false,
            selectedElement: null,
            elementType: null,
        });
    };

    const isSelected = (elementId: string) => {
        return editState.selectedElement === elementId;
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        // Deselect any element when toggling mode
        deselectElement();
    };

    return (
        <EditModeContext.Provider
            value={{
                editState,
                selectElement,
                deselectElement,
                isSelected,
                isEditMode,
                setEditMode: setIsEditMode,
                toggleEditMode,
                allowToggle,
            }}
        >
            {children}
        </EditModeContext.Provider>
    );
}

export function useEditMode() {
    const context = useContext(EditModeContext);
    if (context === undefined) {
        throw new Error('useEditMode must be used within an EditModeProvider');
    }
    return context;
}
