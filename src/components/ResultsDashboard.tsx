import { motion } from "framer-motion";
import { ScoreCircle } from "./ScoreCircle";
import { SkillsComparison } from "./SkillsComparison";
import { KeywordTable } from "./KeywordTable";
import { ImprovementSuggestions } from "./ImprovementSuggestions";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export interface AnalysisResult {
  matchScore: number;
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  keywords: {
    keyword: string;
    inResume: boolean;
    inJD: boolean;
    importance: "high" | "medium" | "low";
  }[];
  suggestions: {
    title: string;
    description: string;
    example?: string;
  }[];
  atsTips: string[];
}

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Analysis Results</h2>
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          New Analysis
        </Button>
      </div>

      <div className="flex justify-center gap-12 flex-wrap">
        <ScoreCircle score={result.matchScore} label="Match Score" />
        <ScoreCircle score={result.atsScore} label="ATS Score" />
      </div>

      <SkillsComparison matched={result.matchedSkills} missing={result.missingSkills} />

      <div className="space-y-3">
        <h3 className="font-display text-lg font-semibold">Keyword Analysis</h3>
        <KeywordTable keywords={result.keywords} />
      </div>

      <ImprovementSuggestions suggestions={result.suggestions} atsTips={result.atsTips} />
    </motion.div>
  );
}
