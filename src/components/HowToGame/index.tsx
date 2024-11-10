// components/StepContent.tsx
import React from "react";

interface StepContentProps {
  title: string;
  description: string;
  imageSrc?: string;
}

const StepContent: React.FC<StepContentProps> = ({ title, description, imageSrc }) => {
  return (
    <div className="mb-6 flex flex-col items-center text-center">
      {imageSrc && (
        <div className="mb-4">
          <img src={imageSrc} alt={title} className="w-32 h-32 object-contain" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
};

export default StepContent;
