import { cn } from "@/lib/utils";

interface SkillChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const SkillChip = ({ label, selected, onClick }: SkillChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
        "border backdrop-blur-sm text-center",
        selected
          ? "bg-secondary/20 border-secondary text-secondary shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20"
      )}
    >
      {label}
    </button>
  );
};

export default SkillChip;
