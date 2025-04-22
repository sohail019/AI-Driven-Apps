"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export default function ExperienceRatingSlider() {
  const [value, setValue] = useState([3]);

  const emojis = ["😡", "🙁", "😐", "🙂", "😍"];
  const labels = ["Awful", "Poor", "Okay", "Good", "Amazing"];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="leading-6">Rate your experience</Label>
        <span className="text-sm font-medium">{labels[value[0] - 1]}</span>
      </div>
      <div className="flex items-center gap-2">
        <Slider
          value={value}
          onValueChange={setValue}
          min={1}
          max={5}
            // showTooltip
            aria-label="Rate your experience"
          />
        <span className="text-2xl">{emojis[value[0] - 1]}</span>
      </div>
    </div>
  );
}
