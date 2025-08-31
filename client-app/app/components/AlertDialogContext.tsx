import { createContext, useContext, useState, type ReactNode } from 'react';
import { AlertDialog } from './AlertDialog';

type AlertDialogOptions = {
    message: string;
    confirmLabel?: string;
    onConfirm?: () => void;
};

type AlertDialogContextType = {
    showAlertDialog: (options: AlertDialogOptions) => void;
    hideAlertDialog: () => void;
};

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

export function AlertDialogProvider({ children }: { children: ReactNode }) {
    const [options, setOptions] = useState<AlertDialogOptions | null>(null);

    const showAlertDialog = (options: AlertDialogOptions) => setOptions(options);
    const hideAlertDialog = () => setOptions(null);

    return (
        <AlertDialogContext.Provider value={{ showAlertDialog, hideAlertDialog }}>
            {children}
            {options && (
                <AlertDialog
                    message={options.message}
                    confirmLabel={options.confirmLabel}
                    onConfirm={() => {
                        options.onConfirm?.();
                        hideAlertDialog();
                    }}
                    onCancel={hideAlertDialog}
                />
            )}
        </AlertDialogContext.Provider>
    );
}

export const useAlertDialog = () => {
    const context = useContext(AlertDialogContext);
    if (!context) throw new Error('useModal must be used within ModalProvider');
    return context;
}
