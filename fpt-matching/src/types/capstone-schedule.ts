import { Project } from "./project";

export interface CapstoneSchedule {
    projectId?: string;
    time?: string;
    date?: string; 
    hallName?: string;
    stage?: number;
    project?: Project | null;
}