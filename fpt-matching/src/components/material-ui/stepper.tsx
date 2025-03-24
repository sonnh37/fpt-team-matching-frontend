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
  status?: string;
}
const steps: StepperProps[] = [
  {
    label: "Mentor",
  },
  {
    label: "Council",
  },
  {
    label: "Finish",
  },
];

interface HorizontalLinearStepperProps {
  idea?: Idea;
}
export default function HorizontalLinearStepper({
  idea,
}: HorizontalLinearStepperProps) {
  if (!idea) return;
  const user = useSelectorUser();
  if (!user) return;
  const idea_request = idea.ideaRequests;
  const totalCouncilApprove = idea_request?.filter(
    (req) => req.status === IdeaRequestStatus.Approved && req.role === "Council"
  ).length;

  const totalCouncil = idea_request?.filter(
    (req) => req.role === "Council"
  ).length;

  const isStudent = user?.userXRoles.some((m) => m.role?.roleName == "Student");

  const totalCouncilPending = idea_request?.filter(
    (req) => req.status === IdeaRequestStatus.Pending && req.role === "Council"
  ).length;

  console.log("check", totalCouncilPending);

  const isResultDay = idea.stageIdea?.resultDate
    ? new Date(idea.stageIdea.resultDate).getTime() < Date.now()
    : false;

  const isMentorApprove = idea_request?.some(
    (req) => req.status === IdeaRequestStatus.Approved && req.role === "Mentor"
  );
  const isMentorRejected = idea_request?.some(
    (req) => req.status === IdeaRequestStatus.Rejected && req.role === "Mentor"
  );
  // xét thêm && stageIdea
  const isCouncilApprove = totalCouncilApprove >= 2;
  const isCouncilRejected = totalCouncilApprove < 2;
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === -1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const isStepFailed = (step: number) => {
    return step === -1;
  };

  const isLecturer = user?.userXRoles.some(
    (m) => m.role?.roleName == "Lecturer"
  );
  React.useEffect(() => {
    if (idea) {
      if (isLecturer && totalCouncil == 0) {
        console.log("first step");
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        return;
      }
      if (isStudent) {
        if (isMentorApprove) {
          console.log("first step");
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        if (isCouncilApprove && isResultDay) {
          console.log("two step");
          setActiveStep((prevActiveStep) => prevActiveStep + 2);
        }
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 0);
    }
  }, [idea]);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
            error?: boolean;
          } = {};

          if (isMentorRejected && index == 0) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                Rejected
              </Typography>
            );
            labelProps.error = true;
          }

          if (
            (totalCouncilPending > 0 ||
              (isMentorApprove && isCouncilRejected)) &&
            isResultDay &&
            index == 1
          ) {
            labelProps.optional = (
              <Typography variant="caption" color="error">
                Rejected
              </Typography>
            );
            labelProps.error = true;
          }

          return (
            <Step key={step.label} {...stepProps}>
              <StepLabel {...labelProps}>{step.label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
