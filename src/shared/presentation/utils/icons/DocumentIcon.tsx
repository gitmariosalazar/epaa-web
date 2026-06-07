import React from 'react';
import {
  BsFileEarmarkWord,
  BsFileEarmarkExcel,
  BsFileEarmarkImage,
  BsFileEarmarkZip,
  BsFileEarmarkMusic,
  BsFileEarmarkPlay,
  BsFileEarmarkText,
  BsFileEarmark
} from 'react-icons/bs';
import { FaFilePdf, FaFilePowerpoint } from 'react-icons/fa6';

interface DocumentIconProps {
  fileName?: string;
  size?: number;
  className?: string;
  color?: string; // Optional custom color override
}

export const DocumentIcon: React.FC<DocumentIconProps> = ({
  fileName = '',
  size = 20,
  className = '',
  color
}) => {
  // Extract file extension from name/URL
  const getExtension = (name: string): string => {
    if (!name) return '';
    try {
      // Strip potential query parameters or hashes
      const cleanName = name.split('?')[0].split('#')[0];
      const parts = cleanName.split('.');
      return parts.length > 1 ? parts.pop()!.toLowerCase().trim() : '';
    } catch {
      return '';
    }
  };

  const ext = getExtension(fileName);

  // Map extensions to corresponding icons and colors
  const getIconConfig = (extension: string) => {
    switch (extension) {
      // PDF documents
      case 'pdf':
        return {
          icon: <FaFilePdf size={size} className={className} style={{ color: color || '#ef4444' }} />
        };

      // Word documents / Rich texts
      case 'doc':
      case 'docx':
      case 'odt':
      case 'rtf':
        return {
          icon: <BsFileEarmarkWord size={size} className={className} style={{ color: color || '#2563eb' }} />
        };

      // Excel spreadsheets / CSVs
      case 'xls':
      case 'xlsx':
      case 'csv':
      case 'ods':
        return {
          icon: <BsFileEarmarkExcel size={size} className={className} style={{ color: color || '#10b981' }} />
        };

      // Powerpoint presentations
      case 'ppt':
      case 'pptx':
      case 'odp':
        return {
          icon: <FaFilePowerpoint size={size} className={className} style={{ color: color || '#ea580c' }} />
        };

      // Image formats
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'webp':
      case 'bmp':
      case 'tiff':
        return {
          icon: <BsFileEarmarkImage size={size} className={className} style={{ color: color || '#06b6d4' }} />
        };

      // Compressed / Archive folders
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return {
          icon: <BsFileEarmarkZip size={size} className={className} style={{ color: color || '#d97706' }} />
        };

      // Audio formats
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'ogg':
      case 'm4a':
        return {
          icon: <BsFileEarmarkMusic size={size} className={className} style={{ color: color || '#8b5cf6' }} />
        };

      // Video formats
      case 'mp4':
      case 'mkv':
      case 'avi':
      case 'mov':
      case 'webm':
        return {
          icon: <BsFileEarmarkPlay size={size} className={className} style={{ color: color || '#d946ef' }} />
        };

      // Plain text or Markdown files
      case 'txt':
      case 'md':
        return {
          icon: <BsFileEarmarkText size={size} className={className} style={{ color: color || '#64748b' }} />
        };

      // Fallback default file icon
      default:
        return {
          icon: <BsFileEarmark size={size} className={className} style={{ color: color || '#94a3b8' }} />
        };
    }
  };

  const { icon } = getIconConfig(ext);

  return icon;
};
