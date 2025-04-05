"use client";

import {Badge} from "@/components/ui/badge";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {IdeaStatus} from "@/types/enums/idea";
import {Idea} from "@/types/idea";
import {FileText, Users, UserCog, Eye, Download} from "lucide-react";
import {LinkPreview} from "@/components/ui/link-preview";
import {getFileNameFromUrl, getPreviewUrl} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface IdeaDetailFormProps {
    idea: Idea;
}

export const IdeaDetailForm = ({idea}: IdeaDetailFormProps) => {
    return (
        <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <FileText className="h-5 w-5"/>
                    <h3>Basic Information</h3>
                </div>
                <Separator/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Vietnamese Name</Label>
                        <p className="text-sm italic font-medium">{idea.vietNamName || "-"}</p>
                    </div>

                    <div className="space-y-1">
                        <Label>English Name</Label>
                        <p className="text-sm italic font-medium">{idea.englishName || "-"}</p>
                    </div>

                    <div className="space-y-1">
                        <Label>Abbreviations</Label>
                        <p className="text-sm italic font-medium">{idea.abbreviations || "-"}</p>
                    </div>

                    <div className="space-y-1">
                        <Label>Status</Label>
                        <div><StatusBadge status={idea.status}/></div>
                    </div>

                    <div className="space-y-1">
                        <Label>Idea Code</Label>
                        <p className="text-sm italic font-medium">{idea.ideaCode || "-"}</p>
                    </div>

                    <div className="space-y-1">
                        <Label>Type</Label>
                        <p className="text-sm italic font-medium">{idea.type || "-"}</p>
                    </div>
                </div>

                <div className="space-y-1">
                    <Label>Description</Label>
                    <p className="text-sm italic font-medium">
                        {idea.description || "No description provided"}
                    </p>
                </div>
            </div>

            {/* Team & Mentorship Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-5 w-5"/>
                    <h3>Team & Mentorship</h3>
                </div>
                <Separator/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Owner</Label>
                        <p className="text-sm italic font-medium">
                            {idea.owner?.email || "Unknown"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <Label>Mentor</Label>
                        <p className="text-sm italic font-medium">
                            {idea.mentor?.email || "Not assigned"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <Label>Sub-Mentor</Label>
                        <p className="text-sm italic font-medium">
                            {idea.subMentor?.email || "Not assigned"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <Label>Max Team Size</Label>
                        <p className="text-sm italic font-medium">{idea.maxTeamSize || "-"}</p>
                    </div>

                    <div className="space-y-1">
                        <Label>Enterprise Topic</Label>
                        <p className="text-sm italic font-medium">
                            {idea.isEnterpriseTopic ? "Yes" : "No"}
                        </p>
                    </div>
                </div>

                {idea.isEnterpriseTopic && (
                    <div className="space-y-1">
                        <Label>Enterprise Name</Label>
                        <p className="text-sm italic font-medium">{idea.enterpriseName || "-"}</p>
                    </div>
                )}
            </div>

            {/* Specialty & Project Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <UserCog className="h-5 w-5"/>
                    <h3>Specialty & Project</h3>
                </div>
                <Separator/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Specialty</Label>
                        <p className="text-sm italic font-medium">
                            {idea.specialty?.specialtyName || "-"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <Label>Related Project</Label>
                        <p className="text-sm italic font-medium">
                            {idea.project?.teamName || "-"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <FileText className="h-5 w-5"/>
                    <h3>Attachments</h3>
                </div>
                <Separator/>

                <div className="space-y-2">
                    <Label>Attached File</Label>
                    {idea.file ? (
                        <div className="flex items-center gap-3">
                            <p className="text-sm italic font-medium flex-1 truncate">
                                {getFileNameFromUrl(idea.file)}
                            </p>

                            {/* Preview Button */}
                            <Link href={getPreviewUrl(idea.file)} target="_blank"
                                  rel="noopener noreferrer">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <Eye className="h-4 w-4"/>
                                    Preview

                                </Button>
                            </Link>

                            {/* Download Button */}
                            <Link href={idea.file} target="_blank"
                                  rel="noopener noreferrer">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <Download className="h-4 w-4"/>
                                    Download

                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <p className="text-sm italic text-gray-500 italic">No file attached</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({status}: { status?: IdeaStatus }) => {
    if (status === undefined) return <Badge variant="outline">Unknown</Badge>;

    const statusText = IdeaStatus[status];

    let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
        "default";

    switch (status) {
        case IdeaStatus.Pending:
            badgeVariant = "secondary";
            break;
        case IdeaStatus.Approved:
            badgeVariant = "default";
            break;
        case IdeaStatus.Rejected:
            badgeVariant = "destructive";
            break;
        default:
            badgeVariant = "outline";
    }

    return <Badge variant={badgeVariant}>{statusText}</Badge>;
};