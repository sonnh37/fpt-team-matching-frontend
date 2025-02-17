import { Card } from "@/components/ui/card";
import { Project } from "@/types/project";

import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
interface ProjectDetailProps {
  project?: Project;
}

const ProjectDetail = ({ project = undefined }: ProjectDetailProps) => {
  return (
    <></>
  );
};

export default ProjectDetail;
