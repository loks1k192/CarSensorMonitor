export default function CarCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton" />
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-6 w-24 skeleton" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-3 skeleton" />
          <div className="h-3 skeleton" />
          <div className="h-3 skeleton" />
          <div className="h-3 skeleton" />
        </div>
      </div>
    </div>
  );
}
