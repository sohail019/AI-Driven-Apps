import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface HoverableTagListProps {
  items: string[];
  visibleCount?: number;
  itemClassName?: string;
}

export const HoverableTagList: React.FC<HoverableTagListProps> = ({
  items,
  visibleCount = 1,
  itemClassName = "",
}) => {
  const visibleItems = items.slice(0, visibleCount);
  const hiddenCount = items.length - visibleItems.length;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-wrap items-center gap-2 cursor-pointer">
          {visibleItems.map((item, index) => (
            <span
              key={index}
              className={`text-sm px-2 py-1 rounded-full  ${itemClassName}`}
            >
              {item}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="text-xs text-blue-500">+{hiddenCount}</span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        className="p-3 w-[250px] bg-white border border-gray-300 rounded-md shadow-md"
      >
        <ul className="text-sm text-gray-700 list-disc pl-4">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
};
