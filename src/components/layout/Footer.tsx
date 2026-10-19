import { FOOTER_TEXT } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-20 lg:pl-64 pointer-events-none">
      <div className="bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-4 py-2">
        <p className="text-center text-[11px] text-slate-400 font-medium tracking-wide pointer-events-auto">
          {FOOTER_TEXT}
        </p>
      </div>
    </footer>
  );
}
