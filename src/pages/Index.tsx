import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { ResumeUpload } from "@/components/ResumeUpload";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { ResultsDashboard, type AnalysisResult } from "@/components/ResultsDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      toast({
        title: "Missing input",
        description: "Please upload a resume and paste a job description.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Convert file to base64
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: {
          resumeBase64: base64,
          fileName: file.name,
          jobDescription: jobDescription.trim(),
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as AnalysisResult);
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast({
        title: "Analysis failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription("");
    setResult(null);
  };

  const canAnalyze = file && jobDescription.trim().length > 20;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl py-8 md:py-12">
        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Hero */}
            <section className="text-center space-y-4">
              <h1 className="font-display text-4xl font-bold md:text-5xl">
                Match Your Resume to
                <span className="text-primary"> Any Job</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Upload your resume and paste a job description to get an AI-powered analysis
                with actionable improvement suggestions.
              </p>
            </section>

            {/* Input Section */}
            <Card className="shadow-lg">
              <CardContent className="space-y-6 p-6 md:p-8">
                <ResumeUpload file={file} onFileChange={setFile} />
                <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Sparkles className="h-5 w-5" />
                  Analyze Match
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {loading && <LoadingAnalysis />}

        {result && <ResultsDashboard result={result} onReset={handleReset} />}
      </main>
    </div>
  );
};

export default Index;
