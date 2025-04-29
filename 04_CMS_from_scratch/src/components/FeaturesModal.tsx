import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: string[];
  title: string;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({
  isOpen,
  onClose,
  features,
  title,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-2 p-4">
          {features.map((feature, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="max-w-[200px] truncate">
                    {feature}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{feature}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeaturesModal;
