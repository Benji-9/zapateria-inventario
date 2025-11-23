import React, { useState } from 'react';
import api from '../services/api';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ExcelUploadProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onClose, onSuccess }) => {
    const { showToast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await api.post('/productos/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            showToast('Importación exitosa', 'success');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error importing:', error);
            showToast(error.response?.data || 'Error al importar', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <X size={20} />
                </button>

                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileSpreadsheet className="text-green-600" /> Importar Excel
                </h3>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:bg-gray-50 transition-colors relative">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600">
                        {file ? file.name : 'Arrastra o selecciona un archivo Excel'}
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="btn btn-secondary" disabled={uploading}>
                        Cancelar
                    </button>
                    <button
                        onClick={handleUpload}
                        className="btn btn-primary"
                        disabled={!file || uploading}
                    >
                        {uploading ? 'Subiendo...' : 'Importar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExcelUpload;
