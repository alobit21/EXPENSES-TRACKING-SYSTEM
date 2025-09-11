import React from 'react';
import { Download, FileText, FileSpreadsheet, FileJson } from 'lucide-react';

interface DownloadButtonProps {
  onDownloadPDF: () => void;
  onDownloadCSV: () => void;
  onDownloadJSON: () => void;
  isLoading?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onDownloadPDF,
  onDownloadCSV,
  onDownloadJSON,
  isLoading = false,
}) => {
  return (
    <div className="relative group">
      <button
        disabled={isLoading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
      >
        <Download size={20} />
        {isLoading ? 'Preparing...' : 'Download Report'}
      </button>
      
      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          <button
            onClick={onDownloadPDF}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <FileText size={16} />
            Download PDF
          </button>
          <button
            onClick={onDownloadCSV}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <FileSpreadsheet size={16} />
            Download CSV
          </button>
          <button
            onClick={onDownloadJSON}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <FileJson size={16} />
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadButton;