import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useAutoSave = (data: any, delay: number = 200) => {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem("resumeFormData", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save form data:", error);
        toast({
          title: "Auto-save failed",
          description: "Unable to save your progress",
          variant: "destructive",
        });
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, toast]);
};
