import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        info: <Info size={20} />
    };

    return (
        <div className={`fixed bottom-4 right-4 ${bgColors[type]} text-white px-4 py-3 rounded shadow-lg flex items-center gap-2 z-50 animate-fade-in-up`}>
            {icons[type]}
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 hover:text-gray-200">
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
