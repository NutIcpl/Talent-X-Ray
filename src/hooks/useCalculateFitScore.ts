import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CalculateFitScoreParams {
  candidateId: string;
  applicationId: string;
  jobPositionId: string;
}

export const useCalculateFitScore = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ candidateId, applicationId, jobPositionId }: CalculateFitScoreParams) => {
      // Get candidate data
      const { data: candidate, error: candidateError } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", candidateId)
        .single();

      if (candidateError) throw candidateError;

      // Get job position data
      const { data: jobPosition, error: jobError } = await supabase
        .from("job_positions")
        .select("*")
        .eq("id", jobPositionId)
        .single();

      if (jobError) throw jobError;

      // Call edge function to calculate score with AI
      const { data: aiResult, error: aiError } = await supabase.functions.invoke(
        "calculate-fit-score",
        {
          body: {
            candidateData: {
              name: candidate.name,
              education: candidate.education,
              experience_years: candidate.experience_years,
              skills: candidate.skills,
              resume_text: candidate.resume_text,
            },
            jobData: {
              title: jobPosition.title,
              department: jobPosition.department,
              requirements: jobPosition.requirements,
              responsibilities: jobPosition.responsibilities,
            },
          },
        }
      );

      let finalScore = 0;
      let reasoning = "";

      if (aiError || !aiResult?.success) {
        // Fallback to local calculation
        const { calculateJobFitScore } = await import("@/lib/calculateJobFitScore");
        finalScore = calculateJobFitScore(candidate, jobPosition);
        reasoning = "คำนวณจากระบบ";
      } else {
        finalScore = aiResult.data.score;
        reasoning = aiResult.data.reasoning;
      }

      // Update application with score
      const { error: updateError } = await supabase
        .from("applications")
        .update({
          ai_fit_score: finalScore,
          ai_fit_reasoning: reasoning,
        })
        .eq("id", applicationId);

      if (updateError) throw updateError;

      return { score: finalScore, reasoning };
    },
    onSuccess: (data) => {
      toast({
        title: "คำนวณคะแนนสำเร็จ",
        description: `คะแนนความเหมาะสม: ${data.score}%`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
