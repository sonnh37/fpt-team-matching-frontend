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
import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { Idea } from "@/types/idea";
import { Box, Button, Typography } from "@mui/material";
import { useSelectorUser } from "@/hooks/use-auth";
import { useCallback } from "react";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";

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
  status?: "pending" | "approved" | "rejected" | "skipped";
  optionalLabel?: string;
}

interface HorizontalLinearStepperProps {
  idea?: Idea;
}

export default function HorizontalLinearStepper({
  idea,
}: HorizontalLinearStepperProps) {
  if (!idea) return null;
  const user = useSelectorUser();
  if (!user) return null;

  // State management
  const [activeStep, setActiveStep] = React.useState(0);
  const [steps, setSteps] = React.useState<StepperProps[]>([]);

  // Derived data calculation
  const calculateStepData = useCallback(() => {
    const highestVersion =
      idea.ideaVersions.length > 0
        ? idea.ideaVersions.reduce((prev, current) =>
            (prev.version ?? 0) > (current.version ?? 0) ? prev : current
          )
        : undefined;
    const ideaVersionRequests = highestVersion?.ideaVersionRequests || [];
    const isStudent = user.userXRoles?.some(
      (m) => m.role?.roleName === "Student"
    );
    const isLecturer = user.userXRoles?.some(
      (m) => m.role?.roleName === "Lecturer"
    );
    const resultDate = idea.stageIdea?.resultDate
      ? new Date(idea.stageIdea.resultDate)
      : null;
    const isResultDay = resultDate ? resultDate.getTime() <= Date.now() : false;

    const mentorApproval = ideaVersionRequests.find((req) => req.role === "Mentor");
    const councilApprovals = ideaVersionRequests.filter(
      (req) => req.role === "Council"
    );

    const isMentorApproved =
      mentorApproval?.status === IdeaVersionRequestStatus.Approved;
    const isMentorRejected =
      mentorApproval?.status === IdeaVersionRequestStatus.Rejected;

    const totalCouncilApproved = councilApprovals.filter(
      (req) => req.status === IdeaVersionRequestStatus.Approved
    ).length;

    const isCouncilApproved = isResultDay && totalCouncilApproved >= 2;
    const isCouncilRejected =
      isResultDay && !isCouncilApproved && councilApprovals.length > 0;

    // Step configuration
    const newSteps: StepperProps[] = [
      {
        label: "Create Idea",
        status: "approved",
      },
      {
        label: "Mentor Approval",
        status: isMentorRejected
          ? "rejected"
          : isMentorApproved
          ? "approved"
          : "pending",
        optionalLabel: isMentorRejected ? "Rejected" : undefined,
      },
      {
        label: "Council Approval",
        status: isCouncilRejected
          ? "rejected"
          : isCouncilApproved
          ? "approved"
          : "pending",
        optionalLabel: isCouncilRejected ? "Rejected" : undefined,
      },
    ];

    // Active step calculation
    let newActiveStep = 0;
    if (isLecturer && councilApprovals.length === 0) {
      newActiveStep = 1;
    } else if (isStudent) {
      if (isMentorApproved && !isCouncilApproved) newActiveStep = 1;
      if (isResultDay) {
        if (isCouncilApproved) newActiveStep = 2;
      }
    }

    return { newSteps, newActiveStep };
  }, [idea, user]);

  // Effect for updating steps and active step
  React.useEffect(() => {
    const { newSteps, newActiveStep } = calculateStepData();
    setSteps(newSteps);
    setActiveStep(newActiveStep);
  }, [calculateStepData]);

  // Render function remains the same
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode; error?: boolean } =
            {};

          if (step.status === "rejected") {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                {step.optionalLabel || "Rejected"}
              </Typography>
            );
            labelProps.error = true;
          }

          if (step.status === "approved") {
            stepProps.completed = true;
          }

          return (
            <Step key={`${step.label}-${index}`} {...stepProps}>
              <StepLabel {...labelProps}>
                {step.label}
                {/* {idea.stageIdea?.resultDate && index === steps.length - 1 && (
                  <Typography variant="caption" display="block">
                    Deadline:{" "}
                    {new Date(idea.stageIdea.resultDate).toLocaleDateString()}
                  </Typography>
                )} */}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
