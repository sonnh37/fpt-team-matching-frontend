"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { User } from "@/types/user";
import { userService } from "@/services/user-service";
import { Department, Gender } from "@/types/enums/user";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { ProfileStudent } from "@/types/profile-student";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TypographySmall } from "@/components/_common/typography/typography-small";
import {
  Activity,
  Calendar,
  Download,
  Home,
  Loader2,
  Mail,
  Phone,
} from "lucide-react";
import { BsGenderAmbiguous } from "react-icons/bs";

const Icons = {
  spinner: Loader2,
  mail: Mail,
  phone: Phone,
  home: Home,
  calendar: Calendar,
  gender: BsGenderAmbiguous,
  activity: Activity,
  download: Download,
};
export default function ProfilePage() {
  const { profileId } = useParams();

  const {
    data: result,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["getUserInfo", profileId],
    queryFn: () => userService.getById(profileId?.toString()),
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  if (isError) return <div>Error: {error.message}</div>;
  if (!result) return <div>No data</div>;

  const user = result.data as User;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <ProfileCard user={user} />
          <ContactCard user={user} />
        </div>

        {/* Main content */}
        <div className="lg:col-span-2">
          <ProfileTabs user={user} />
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader className="items-center">
        <Avatar className="h-32 w-32 mb-4">
          <AvatarImage src={user.avatar || undefined} />
          <AvatarFallback>
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
          {user.department && (
            <Badge variant="outline" className="mt-2">
              {Department[user.department]}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {user.gender ? (
          <div className="flex items-center">
            <Icons.gender className="h-4 w-4 mr-2" />
            <span>{Gender[user.gender]}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Icons.gender className="h-4 w-4 mr-2" />
            <span>{Gender[Gender.Other]}</span>
          </div>
        )}
        {user.dob && (
          <div className="flex items-center">
            <Icons.calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(user.dob)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ContactCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.email && (
          <div className="flex items-center">
            <Icons.mail className="h-4 w-4 mr-2" />
            <span>{user.email}</span>
          </div>
        )}
        {user.phone && (
          <div className="flex items-center">
            <Icons.phone className="h-4 w-4 mr-2" />
            <span>{user.phone}</span>
          </div>
        )}
        {user.address && (
          <div className="flex items-center">
            <Icons.home className="h-4 w-4 mr-2" />
            <span>{user.address}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProfileTabs({ user }: { user: User }) {
  return (
    <Tabs defaultValue="personal">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="academic">Academic</TabsTrigger>
        <TabsTrigger value="activities">Activities</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <PersonalInfo user={user} />
      </TabsContent>

      <TabsContent value="academic">
        <AcademicInfo profile={user.profileStudent} />
      </TabsContent>

      <TabsContent value="activities">
        <ActivitiesInfo />
      </TabsContent>
    </Tabs>
  );
}

function PersonalInfo({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="First Name" value={user.firstName} />
        <InfoField label="Last Name" value={user.lastName} />
        <InfoField label="Gender" value={user.gender ?? Gender.Other} />
        <InfoField
          label="Date of Birth"
          value={user.dob ? formatDate(user.dob) : ""}
        />
        <InfoField label="Department" value={user.department} />
        <InfoField label="Student Code" value={user.code} />
      </CardContent>
    </Card>
  );
}

function AcademicInfo({ profile }: { profile?: ProfileStudent }) {
  if (!profile) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p>No academic profile available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            label="Specialty"
            value={profile.specialty?.specialtyName}
          />
          <InfoField label="Semester" value={profile.semester?.semesterName} />
          <InfoField label="Student Code" value={profile.code} />
          <InfoField
            label="Academic Qualification"
            value={
              profile.isQualifiedForAcademicProject
                ? "Qualified"
                : "Not Qualified"
            }
          />
        </CardContent>
      </Card>

      {profile.bio && (
        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.skillProfiles?.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.skillProfiles.map((skillProfile, index) => (
                <Badge key={index} variant="secondary">
                  {skillProfile.fullSkill || `Skill ${index + 1}`}
                </Badge>
              ))}
            </div>
          ) : (
            <p>No skills listed</p>
          )}
        </CardContent>
      </Card>

      {profile.achievement && (
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{profile.achievement}</p>
          </CardContent>
        </Card>
      )}

      {profile.experienceProject && (
        <Card>
          <CardHeader>
            <CardTitle>Project Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">
              {profile.experienceProject}
            </p>
          </CardContent>
        </Card>
      )}

      {profile.interest && (
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{profile.interest}</p>
          </CardContent>
        </Card>
      )}

      {profile.fileCv && (
        <Card>
          <CardHeader>
            <CardTitle>CV</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <a
                href={profile.fileCv}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icons.download className="mr-2 h-4 w-4" />
                Download CV
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ActivitiesInfo() {
  return (
    <Card>
      <CardContent className="py-16 text-center">
        <Icons.activity className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">User Activities</h3>
        <p className="text-sm text-muted-foreground">
          This section would display user's blog posts, projects, ideas, etc.
        </p>
        <Button variant="outline" className="mt-4">
          View activities
        </Button>
      </CardContent>
    </Card>
  );
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value?: any | undefined;
}) {
  if (!value) return null;

  return (
    <div>
      <TypographySmall className="text-muted-foreground">
        {label}
      </TypographySmall>
      <TypographyP className="!mt-3 font-medium">{value}</TypographyP>
    </div>
  );
}
