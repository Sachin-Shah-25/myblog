
export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-3">
        
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}