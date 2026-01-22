import { Menu, Share2, Handshake } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  onShareClick?: () => void;
}

export const Header = ({ onMenuClick, onShareClick }: HeaderProps) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="text-slate-600 hover:text-slate-900 transition-colors duration-200"
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>

        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <Handshake size={28} className="text-slate-900" />
            <h1 className="text-2xl font-semibold text-slate-900 pacifico">
              Trusted Hand
            </h1>
          </div>
        </div>

        <button
          onClick={onShareClick}
          className="text-slate-600 hover:text-slate-900 transition-colors duration-200"
          aria-label="Share"
        >
          <Share2 size={24} />
        </button>
      </div>
    </header>
  );
};
