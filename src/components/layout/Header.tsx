export function Header() {
  return (
    <header className="mb-12">
      <h1 className="text-4xl font-black text-blue-400 italic uppercase tracking-tighter">
        <span className="font-black text-blue-200 drop-shadow-[0_0_10px_rgba(191,219,254,0.5)]">
          S&S KTV
        </span>
        <span className="text-white not-italic font-light tracking-[0.2em] ml-2">
          Management
        </span>
      </h1>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <p className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">
          System Live
        </p>
      </div>
    </header>
  );
}