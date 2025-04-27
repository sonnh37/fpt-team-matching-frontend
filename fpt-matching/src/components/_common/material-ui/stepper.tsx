import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Box, Typography } from "@mui/material";
import { useSelectorUser } from "@/hooks/use-auth";
import { useCallback } from "react";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { Idea } from "@/types/idea";

interface StepperProps {
  label: string;
  status?: "pending" | "approved" | "rejected" | "consider-by-mentor" | "consider-by-council";
  optionalLabel?: string;
}

interface HorizontalLinearStepperProps {
  idea?: Idea;
}

export default function HorizontalLinearStepper({
  idea,
}: HorizontalLinearStepperProps) {
  if (!idea) return null;
  if (!idea.ideaVersions) return <>Không có version hiện tại..</>;
  const user = useSelectorUser();
  if (!user) return null;

  const [activeStep, setActiveStep] = React.useState(0);
  const [steps, setSteps] = React.useState<StepperProps[]>([]);
  const [averageScore, setAverageScore] = React.useState<number>(0);

  const getTodayUtcMidnight = () => {
    const now = new Date();
    const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return new Date(localMidnight.toISOString());
  };

  const calculateStepData = useCallback(() => {
    const highestVersion = idea.ideaVersions.length > 0
      ? idea.ideaVersions.reduce((prev, current) =>
          (prev.version ?? 0) > (current.version ?? 0) ? prev : current
        )
      : undefined;
    
    if (!highestVersion) return { newSteps: [], newActiveStep: 0, averageScore: 0 };

    const ideaVersionRequests = highestVersion?.ideaVersionRequests || [];
    const isStudent = user.userXRoles?.some(m => m.role?.roleName === "Student");
    const isLecturer = user.userXRoles?.some(m => m.role?.roleName === "Lecturer");
    const resultDate = highestVersion?.stageIdea?.resultDate
      ? new Date(highestVersion.stageIdea.resultDate)
      : null;
      
    const todayUtcMidnight = getTodayUtcMidnight();
    const isResultDay = resultDate 
      ? resultDate.getUTCFullYear() <= todayUtcMidnight.getUTCFullYear() &&
        resultDate.getUTCMonth() <= todayUtcMidnight.getUTCMonth() &&
        resultDate.getUTCDate() <= todayUtcMidnight.getUTCDate()
      : false;

    const mentorApproval = ideaVersionRequests.find(req => req.role === "Mentor");
    const councilApprovals = ideaVersionRequests.filter(req => req.role === "Council");

    const totalCouncils = councilApprovals.length;
    const MIN_REVIEWERS = 1;
    const requiredReviewers = highestVersion?.stageIdea?.numberReviewer ?? MIN_REVIEWERS;
    
    let averageScore = 0;
    let councilStatus: 'approved' | 'rejected' | 'pending' | 'consider-by-council' = 'pending';
    
    if (totalCouncils >= requiredReviewers) {
      const totalApproved = councilApprovals.filter(
        req => req.status === IdeaVersionRequestStatus.Approved
      ).length;
      const totalConsider = councilApprovals.filter(
        req => req.status === IdeaVersionRequestStatus.Consider
      ).length;
      
      const totalScore = (totalApproved * 1.0) + (totalConsider * 0.5);
      averageScore = totalCouncils > 0 ? totalScore / totalCouncils : 0;
      const APPROVAL_THRESHOLD = 0.5;

      if (isResultDay) {
        councilStatus = averageScore > APPROVAL_THRESHOLD 
          ? 'approved' 
          : averageScore < APPROVAL_THRESHOLD 
            ? 'rejected' 
            : 'consider-by-council';
      }
    }

    const newSteps: StepperProps[] = [
      {
        label: "Tạo ý tưởng",
        status: "approved",
      },
      {
        label: "Duyệt bởi người hướng dẫn",
        status: mentorApproval?.status === IdeaVersionRequestStatus.Rejected
          ? "rejected"
          : mentorApproval?.status === IdeaVersionRequestStatus.Approved
          ? "approved"
          : mentorApproval?.status === IdeaVersionRequestStatus.Consider
          ? "consider-by-mentor"
          : "pending",
        optionalLabel: mentorApproval?.status === IdeaVersionRequestStatus.Rejected 
          ? "Đã từ chối" 
          : mentorApproval?.status === IdeaVersionRequestStatus.Consider
          ? "Cần xem xét"
          : undefined,
      },
      {
        label: "Duyệt bởi hội đồng",
        status: councilStatus,
        optionalLabel: councilStatus === 'rejected' 
          ? "Đã từ chối" 
          : councilStatus === 'consider-by-council'
          ? `Cần xem xét (Điểm: ${averageScore.toFixed(2)})`
          : undefined,
      },
    ];

    let newActiveStep = 0;
    if (isLecturer) {
      if (mentorApproval?.status === IdeaVersionRequestStatus.Approved) {
        newActiveStep = councilApprovals.length > 0 ? 2 : 1;
      }
    } else if (isStudent) {
      if (mentorApproval?.status === IdeaVersionRequestStatus.Approved) {
        newActiveStep = isResultDay ? 2 : 1;
      }
      
    }

    return { newSteps, newActiveStep, averageScore };
  }, [idea, user]);

  React.useEffect(() => {
    const { newSteps, newActiveStep, averageScore } = calculateStepData();
    setSteps(newSteps);
    setActiveStep(newActiveStep);
    setAverageScore(averageScore);
  }, [calculateStepData]);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode; error?: boolean } = {};

          if (step.status === "rejected" || 
              step.status === "consider-by-mentor" || 
              step.status === "consider-by-council") {
            labelProps.optional = (
              <Typography variant="caption" color={
                step.status === "rejected" ? "error" : 
                step.status === "consider-by-mentor" ? "warning" :
                "info"
              }>
                {step.optionalLabel}
              </Typography>
            );
            labelProps.error = step.status === "rejected";
          }

          if (step.status === "approved" || 
              step.status === "consider-by-mentor" || 
              step.status === "consider-by-council") {
            stepProps.completed = true;
          }

          return (
            <Step key={`${step.label}-${index}`} {...stepProps}>
              <StepLabel {...labelProps}>
                {step.label}
                {(step.status === "consider-by-mentor" || step.status === "consider-by-council") && (
                  <Typography variant="caption" display="block" color={
                    step.status === "consider-by-mentor" ? "warning.main" : "info.main"
                  }>
                    {step.status === "consider-by-council" ? `Điểm: ${averageScore.toFixed(2)}` : "Cần xem xét"}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}