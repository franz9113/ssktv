import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
}

export default function LoadingState({ message = "SYNCING SYSTEM..." }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-500">
      {/* Icon Stack */}
      <div className="relative flex items-center justify-center">
        {/* The Glow Effect */}
        <div className="absolute w-12 h-12 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
        
        {/* The Main Spinning Icon */}
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" strokeWidth={2.5} />
      </div>
      
      {/* Text Area */}
      <div className="mt-8 text-center space-y-2">
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">
          {message}
        </p>
        
        {/* Modern Progress Dots */}
        <div className="flex gap-1.5 justify-center">
          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}