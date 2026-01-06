interface GradientBlurProps {
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
    size?: "sm" | "md" | "lg";
    color?: "orange" | "white";
    intensity?: "low" | "medium" | "high";
  }
  
  export function GradientBlur({
    position = "top-right",
    size = "md",
    color = "orange",
    intensity = "medium",
  }: GradientBlurProps) {
    const positionClasses = {
      "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
      "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
      "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
      "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
      center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    };
  
    const sizeClasses = {
      sm: "w-[300px] h-[300px]",
      md: "w-[500px] h-[500px]",
      lg: "w-[800px] h-[800px]",
    };
  
    const colorIntensityClasses = {
      orange: {
        low: "bg-brand-orange/10",
        medium: "bg-brand-orange/20",
        high: "bg-brand-orange/30",
      },
      white: {
        low: "bg-white/5",
        medium: "bg-white/10",
        high: "bg-white/15",
      },
    };
  
    return (
      <div
        className={`absolute ${positionClasses[position]} ${sizeClasses[size]} ${colorIntensityClasses[color][intensity]} rounded-full blur-[120px] pointer-events-none`}
        aria-hidden="true"
      />
    );
  }