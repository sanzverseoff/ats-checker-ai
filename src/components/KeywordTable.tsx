import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Keyword {
  keyword: string;
  inResume: boolean;
  inJD: boolean;
  importance: "high" | "medium" | "low";
}

interface KeywordTableProps {
  keywords: Keyword[];
}

export function KeywordTable({ keywords }: KeywordTableProps) {
  const importanceColor = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    low: "bg-muted text-muted-foreground",
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Keyword</TableHead>
            <TableHead className="text-center">In Resume</TableHead>
            <TableHead className="text-center">In JD</TableHead>
            <TableHead className="text-center">Importance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((k) => (
            <TableRow key={k.keyword}>
              <TableCell className="font-medium">{k.keyword}</TableCell>
              <TableCell className="text-center">
                {k.inResume ? "✅" : "❌"}
              </TableCell>
              <TableCell className="text-center">
                {k.inJD ? "✅" : "❌"}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={importanceColor[k.importance]}>
                  {k.importance}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
