import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const FormSection = ({ title, icon, children }: FormSectionProps) => {
  return (
    <div className="glass-card rounded-xl p-6 mb-6 transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.2)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-secondary text-2xl">{icon}</div>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default FormSection;
