import React from "react";
import Skeleton from "../Skeleton";

const MatchCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      {/* Header: format badge + series */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="48px" height="20px" className="rounded-full" />
        <Skeleton width="120px" height="14px" className="rounded" />
      </div>

      {/* Team rows */}
      {[0, 1].map((i) => (
        <div key={i} className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Skeleton variant="circle" width="28px" height="28px" />
            <Skeleton width="80px" height="14px" className="rounded" />
          </div>
          <Skeleton width="80px" height="16px" className="rounded" />
        </div>
      ))}

      {/* Divider */}
      <div className="border-t border-gray-100 my-3" />

      {/* Match note */}
      <Skeleton width="160px" height="13px" className="rounded" />
    </div>
  );
};

export default MatchCardSkeleton;
