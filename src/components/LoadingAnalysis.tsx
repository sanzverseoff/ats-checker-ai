import { motion } from "framer-motion";
import { FileSearch, Brain, BarChart3 } from "lucide-react";

const steps = [
  { icon: FileSearch, label: "Extracting resume text..." },
  { icon: Brain, label: "Analyzing with AI..." },
  { icon: BarChart3, label: "Generating results..." },
];

export function LoadingAnalysis() {
  return (
    <div className="flex flex-col items-center gap-8 py-16">
      <motion.div
        className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 1.5, duration: 0.5 }}
          >
            <step.icon className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">{step.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
