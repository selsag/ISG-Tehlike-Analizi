
import React from 'react';
import {
  Printer, Plus, Trash2, HelpCircle, X, Users, RotateCcw,
  Download, Upload, ChevronUp, Mic, Maximize2, Paperclip, Camera, Image as ImageIcon,
  Loader2, Lightbulb, Copy, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, Palette, Type
} from 'lucide-react';

export const IconPrinter: React.FC = React.memo(() => <Printer className="w-5 h-5" />);
export const IconPlus: React.FC = React.memo(() => <Plus className="w-4 h-4" />);
export const IconTrash: React.FC = React.memo(() => <Trash2 className="w-6 h-6 stroke-current" />);
export const IconHelp: React.FC = React.memo(() => <HelpCircle className="w-[14px] h-[14px] inline stroke-current" />);
export const IconX: React.FC<{ className?: string }> = React.memo(({ className }) => <X className={className || "w-6 h-6"} />);
export const IconUsers: React.FC = React.memo(() => <Users className="w-5 h-5" />);
export const IconRotateCcw: React.FC = React.memo(() => <RotateCcw className="w-5 h-5 stroke-current" />);
export const IconDownload: React.FC = React.memo(() => <Download className="w-5 h-5 stroke-current" />);
export const IconUpload: React.FC = React.memo(() => <Upload className="w-5 h-5 stroke-current" />);
export const IconChevronUp: React.FC<{ isCollapsed: boolean; className?: string }> = React.memo(({ isCollapsed, className = "w-6 h-6" }) => 
  <ChevronUp className={`${className} stroke-current toggle-icon ${isCollapsed ? 'toggle-icon-collapsed' : ''}`} />
);
export const IconMic: React.FC<{ isListening: boolean }> = React.memo(({ isListening }) => 
    <Mic className={`w-5 h-5 ${isListening ? 'text-red-500' : ''}`} />
);
export const IconMaximize: React.FC = React.memo(() => <Maximize2 className="w-4 h-4" strokeWidth="2" />);
export const IconPaperclip: React.FC = React.memo(() => <Paperclip className="w-4 h-4" strokeWidth="2" />);
export const IconPaperclipSmall: React.FC = React.memo(() => <Paperclip className="w-4 h-4" strokeWidth="2" />);
export const IconCamera: React.FC = React.memo(() => <Camera className="w-4 h-4" strokeWidth="2" />);
export const IconImage: React.FC = React.memo(() => <ImageIcon className="w-6 h-6" strokeWidth="2" />);
export const IconLoader: React.FC = React.memo(() => <Loader2 className="w-5 h-5 animate-spin" />);
export const IconLightbulb: React.FC = React.memo(() => <Lightbulb className="w-4 h-4" />);
export const IconLoaderSmall: React.FC = React.memo(() => <Loader2 className="w-4 h-4 animate-spin" />);
export const IconCopy: React.FC = React.memo(() => <Copy className="w-6 h-6 stroke-current" />);
export const IconCopySmall: React.FC = React.memo(() => <Copy className="w-4 h-4" />);

// Text Editor Icons
export const IconBold: React.FC = React.memo(() => <Bold className="w-4 h-4" />);
export const IconItalic: React.FC = React.memo(() => <Italic className="w-4 h-4" />);
export const IconUnderline: React.FC = React.memo(() => <Underline className="w-4 h-4" />);
export const IconAlignLeft: React.FC = React.memo(() => <AlignLeft className="w-4 h-4" />);
export const IconAlignCenter: React.FC = React.memo(() => <AlignCenter className="w-4 h-4" />);
export const IconAlignRight: React.FC = React.memo(() => <AlignRight className="w-4 h-4" />);
export const IconList: React.FC = React.memo(() => <List className="w-4 h-4" />);
export const IconPalette: React.FC = React.memo(() => <Palette className="w-4 h-4" />);
export const IconType: React.FC = React.memo(() => <Type className="w-4 h-4" />);
