import { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
}

interface ConfirmOptions {
    title?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

interface NotificationContextType {
    notifications: Notification[];
    notify: (message: string, type?: NotificationType, duration?: number) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
    confirm: (message: string, options: ConfirmOptions) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [confirmDialog, setConfirmDialog] = useState<{
        message: string;
        options: ConfirmOptions;
    } | null>(null);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const notify = useCallback(
        (message: string, type: NotificationType = 'info', duration: number = 3000) => {
            const id = `${Date.now()}-${Math.random()}`;
            setNotifications((prev) => [...prev, { id, message, type, duration }]);

            if (duration > 0) {
                setTimeout(() => removeNotification(id), duration);
            }
        },
        [removeNotification]
    );

    const success = useCallback((message: string) => notify(message, 'success'), [notify]);
    const error = useCallback((message: string) => notify(message, 'error', 5000), [notify]);
    const warning = useCallback((message: string) => notify(message, 'warning', 4000), [notify]);
    const info = useCallback((message: string) => notify(message, 'info'), [notify]);

    const confirm = useCallback((message: string, options: ConfirmOptions) => {
        setConfirmDialog({ message, options });
    }, []);

    const handleConfirm = () => {
        confirmDialog?.options.onConfirm();
        setConfirmDialog(null);
    };

    const handleCancel = () => {
        confirmDialog?.options.onCancel?.();
        setConfirmDialog(null);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                notify,
                success,
                error,
                warning,
                info,
                confirm,
                removeNotification,
            }}
        >
            {children}

            {/* Notifications Container */}
            <div className="notifications-container">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`notification notification-${notif.type}`}
                        onClick={() => removeNotification(notif.id)}
                    >
                        <div className="notification-content">
                            {notif.type === 'success' && <span className="notification-icon">✓</span>}
                            {notif.type === 'error' && <span className="notification-icon">✕</span>}
                            {notif.type === 'warning' && <span className="notification-icon">!</span>}
                            {notif.type === 'info' && <span className="notification-icon">ℹ</span>}
                            <span className="notification-message">{notif.message}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirm Dialog */}
            {confirmDialog && (
                <div className="confirm-dialog-overlay">
                    <div className="confirm-dialog">
                        <div className="confirm-dialog-content">
                            <h3 className="confirm-dialog-title">
                                {confirmDialog.options.title || 'Confirmation'}
                            </h3>
                            <p className="confirm-dialog-message">{confirmDialog.message}</p>
                            <div className="confirm-dialog-buttons">
                                <button
                                    className="btn-cancel"
                                    onClick={handleCancel}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="btn-confirm"
                                    onClick={handleConfirm}
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};
