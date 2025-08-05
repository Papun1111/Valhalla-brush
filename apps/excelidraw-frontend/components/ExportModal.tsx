import { useState } from 'react';
import { X, Download, FileDown } from 'lucide-react';
import { ExportOptions } from '@/utils/pdfExport';

interface ExportModalProps {
  onExport: (options: ExportOptions) => Promise<void>;
  onClose: () => void;
  isExporting: boolean;
}

export function ExportModal({ onExport, onClose, isExporting }: ExportModalProps) {
  const [filename, setFilename] = useState('my-drawing');
  const [format, setFormat] = useState<'a4' | 'letter' | 'custom'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [includeBackground, setIncludeBackground] = useState(true);
  const [quality, setQuality] = useState(0.95);

  const handleExport = async () => {
    const options: ExportOptions = {
      filename,
      format,
      orientation,
      includeBackground,
      quality
    };
    
    await onExport(options);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-green-400" />
            <h2 className="text-white font-semibold text-lg">Export to PDF</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            disabled={isExporting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          
          {/* Filename */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 
                        text-white placeholder-slate-400 focus:border-green-400 
                        focus:outline-none transition-colors"
              placeholder="Enter filename"
              disabled={isExporting}
            />
          </div>

          {/* Format & Orientation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'a4' | 'letter')}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 
                          text-white focus:border-green-400 focus:outline-none transition-colors"
                disabled={isExporting}
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape')}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 
                          text-white focus:border-green-400 focus:outline-none transition-colors"
                disabled={isExporting}
              >
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
              </select>
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quality: {Math.round(quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-green-500"
              disabled={isExporting}
            />
          </div>

          {/* Background Option */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="includeBackground"
              checked={includeBackground}
              onChange={(e) => setIncludeBackground(e.target.checked)}
              className="w-4 h-4 text-green-500 rounded focus:ring-green-400"
              disabled={isExporting}
            />
            <label htmlFor="includeBackground" className="text-sm text-slate-300">
              Include white background
            </label>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 
                      rounded-lg transition-colors disabled:opacity-50"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 
                      rounded-lg transition-colors disabled:opacity-50 flex items-center 
                      justify-center gap-2"
            disabled={isExporting || !filename.trim()}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
