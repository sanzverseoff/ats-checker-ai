import { Lightbulb, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Suggestion {
  title: string;
  description: string;
  example?: string;
}

interface ImprovementSuggestionsProps {
  suggestions: Suggestion[];
  atsTips?: string[];
}

export function ImprovementSuggestions({ suggestions, atsTips }: ImprovementSuggestionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-warning" />
        Improvement Suggestions
      </h3>
      <div className="grid gap-3 md:grid-cols-2">
        {suggestions.map((s, i) => (
          <Card key={i} className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{s.description}</p>
              {s.example && (
                <div className="rounded-md bg-muted p-3">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    <p className="text-xs italic">{s.example}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {atsTips && atsTips.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              🤖 ATS Compatibility Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {atsTips.map((tip, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
