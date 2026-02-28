import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Job Description</label>
      <Textarea
        placeholder="Paste the full job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-none"
      />
      <p className="text-xs text-muted-foreground">
        {value.length > 0 ? `${value.split(/\s+/).filter(Boolean).length} words` : "Paste the JD to compare against your resume"}
      </p>
    </div>
  );
}
