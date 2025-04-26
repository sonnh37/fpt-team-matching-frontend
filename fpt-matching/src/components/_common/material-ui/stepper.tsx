import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { Idea } from "@/types/idea";
import { Box, Button, Typography } from "@mui/material";
import { useSelectorUser } from "@/hooks/use-auth";
import { useCallback } from "react";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme }) => ({
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    "& .QontoStepIcon-completedIcon": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[700],
    }),
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          color: "#784af4",
        },
      },
    ],
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
      },
    },
  ],
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

interface StepperProps {
  label: string;
  status?: "pending" | "approved" | "rejected" | "consider";
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
    return new Date(localMidnight.toISOString()); // Chuyển sang UTC
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

console.log("check_date_result", resultDate?.getUTCDate())      
console.log("check_date_new", todayUtcMidnight.getUTCDate())      
    const mentorApproval = ideaVersionRequests.find(req => req.role === "Mentor");
    const councilApprovals = ideaVersionRequests.filter(req => req.role === "Council");

    const totalCouncils = councilApprovals.length;
    const MIN_REVIEWERS = 1;
    const requiredReviewers = highestVersion?.stageIdea?.numberReviewer ?? MIN_REVIEWERS;
    
    let averageScore = 0;
    let councilStatus: 'approved' | 'rejected' | 'pending' | 'consider' = 'pending';
    
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
      console.log("check_averageScore", averageScore);

      if (isResultDay) {
        councilStatus = averageScore > APPROVAL_THRESHOLD 
          ? 'approved' 
          : averageScore < APPROVAL_THRESHOLD 
            ? 'rejected' 
            : 'consider';
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
          : "pending",
        optionalLabel: mentorApproval?.status === IdeaVersionRequestStatus.Rejected 
          ? "Đã từ chối" 
          : undefined,
      },
      {
        label: "Duyệt bởi hội đồng",
        status: councilStatus,
        optionalLabel: councilStatus === 'rejected' 
          ? "Đã từ chối" 
          : councilStatus === 'consider'
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

          if (step.status === "rejected" || step.status === "consider") {
            labelProps.optional = (
              <Typography variant="caption" color={step.status === "rejected" ? "error" : "warning"}>
                {step.optionalLabel}
              </Typography>
            );
            labelProps.error = step.status === "rejected";
          }

          if (step.status === "approved" || step.status === "consider") {
            stepProps.completed = true;
          }

          return (
            <Step key={`${step.label}-${index}`} {...stepProps}>
              <StepLabel {...labelProps}>
                {step.label}
                {step.status === "consider" && (
                  <Typography variant="caption" display="block" color="warning.main">
                    Điểm: {averageScore.toFixed(2)}
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