import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SkillsComparisonProps {
  matched: string[];
  missing: string[];
}

export function SkillsComparison({ matched, missing }: SkillsComparisonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Matched Skills ({matched.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {matched.map((s) => (
            <Badge key={s} variant="secondary" className="bg-success/10 text-success border-success/20">
              {s}
            </Badge>
          ))}
          {matched.length === 0 && <p className="text-sm text-muted-foreground">None found</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <XCircle className="h-5 w-5 text-destructive" />
            Missing Skills ({missing.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {missing.map((s) => (
            <Badge key={s} variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
              {s}
            </Badge>
          ))}
          {missing.length === 0 && <p className="text-sm text-muted-foreground">None — great match!</p>}
        </CardContent>
      </Card>
    </div>
  );
}
