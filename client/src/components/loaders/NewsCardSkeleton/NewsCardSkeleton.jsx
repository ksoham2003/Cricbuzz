import React from "react";
import Skeleton from "../Skeleton";

const NewsCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Image */}
      <Skeleton className="w-full h-44 rounded-none" />

      <div className="p-4 space-y-3">
        {/* Category badge */}
        <Skeleton width="70px" height="18px" className="rounded-full" />

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-5/6 h-4 rounded" />
          <Skeleton className="w-4/6 h-4 rounded" />
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-1">
          <Skeleton width="70px" height="12px" className="rounded" />
          <Skeleton width="60px" height="12px" className="rounded" />
        </div>
      </div>
    </div>
  );
};

export default NewsCardSkeleton;
