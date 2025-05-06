"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { User } from "@/types/user";
import { userService } from "@/services/user-service";
import { Department, Gender } from "@/types/enums/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { ProfileStudent } from "@/types/profile-student";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  Home,
  Cake,
  GraduationCap,
  BookOpen,
  Award,
  Briefcase,
  Heart,
  FileText,
  Calendar,
  User as UserIcon,
  Loader2,
} from "lucide-react";

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

  if (isLoading) return <ProfileSkeleton />;
  if (isError)
    return (
      <div className="container mx-auto py-4 text-center text-destructive">
        Lỗi: {error.message}
      </div>
    );
  if (!result)
    return (
      <div className="container mx-auto py-4 text-center">
        Không có dữ liệu
      </div>
    );
  if (!result.data) return;
  return (
    <div className="container mx-auto py-4 px-2 sm:px-4">
      <ProfileLayout user={result.data} />
    </div>
  );
}

const ProfileLayout = ({ user }: { user: User }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
      {/* Cột bên trái */}
      <div className="lg:col-span-1 space-y-2">
        <UserProfileCard user={user} />
        <ContactInfoCard user={user} />
      </div>

      {/* Nội dung chính */}
      <div className="lg:col-span-3">
        <ProfileTabs user={user} />
      </div>
    </div>
  );
};

const UserProfileCard = ({ user }: { user: User }) => {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const initials = `${user.firstName?.charAt(0) || ""}${
    user.lastName?.charAt(0) || ""
  }`;

  return (
    <Card className="shadow-sm">
      <CardHeader className="items-center pb-2 space-y-1">
        <Avatar className="h-16 w-16 mb-1 border-2 border-primary">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials || <UserIcon className="h-5 w-5" />}
          </AvatarFallback>
        </Avatar>

        <div className="text-center space-y-0.5">
          <h2 className="text-md font-bold tracking-tight">
            {fullName || "Không có tên"}
          </h2>
          <div className="flex justify-center gap-1">
            {user.department && (
              <Badge variant="secondary" className="text-xs font-normal">
                {Department[user.department]}
              </Badge>
            )}
            {user.code && (
              <Badge variant="outline" className="text-xs font-normal">
                {user.code}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <Separator className="my-1" />

      <CardContent className="pt-2 space-y-1">
        <InfoItem
          icon={<Cake className="h-3 w-3" />}
          label="Ngày sinh"
          value={user.dob ? formatDate(user.dob) : "Không có"}
        />
        <InfoItem
          icon={<UserIcon className="h-3 w-3" />}
          label="Giới tính"
          value={user.gender ? Gender[user.gender] : "Không có"}
        />
      </CardContent>
    </Card>
  );
};

const ContactInfoCard = ({ user }: { user: User }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm flex items-center gap-1">
          <Mail className="h-3 w-3" />
          <span>Liên hệ</span>
        </CardTitle>
      </CardHeader>

      <Separator className="my-1" />

      <CardContent className="pt-1 space-y-1">
        <InfoItem
          icon={<Mail className="h-3 w-3" />}
          label="Email"
          value={user.email || "Không có"}
        />
        <InfoItem
          icon={<Phone className="h-3 w-3" />}
          label="Điện thoại"
          value={user.phone || "Không có"}
        />
        <InfoItem
          icon={<Home className="h-3 w-3" />}
          label="Địa chỉ"
          value={user.address || "Không có"}
        />
      </CardContent>
    </Card>
  );
};

const ProfileTabs = ({ user }: { user: User }) => {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-9">
        <TabsTrigger value="personal" className="flex items-center gap-1 text-xs">
          <UserIcon className="h-3 w-3" />
          Cá nhân
        </TabsTrigger>
        <TabsTrigger value="academic" className="flex items-center gap-1 text-xs">
          <GraduationCap className="h-3 w-3" />
          Học vấn
        </TabsTrigger>
        <TabsTrigger value="activities" className="flex items-center gap-1 text-xs">
          <Award className="h-3 w-3" />
          Hoạt động
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="pt-2">
        <PersonalInfoSection user={user} />
      </TabsContent>

      <TabsContent value="academic" className="pt-2">
        <AcademicInfoSection profile={user.profileStudent} />
      </TabsContent>

      <TabsContent value="activities" className="pt-2">
        <ActivitiesSection />
      </TabsContent>
    </Tabs>
  );
};

const PersonalInfoSection = ({ user }: { user: User }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <InfoCard
        title="Thông tin cơ bản"
        icon={<UserIcon className="h-3 w-3" />}
        items={[
          { label: "Họ", value: user.lastName },
          { label: "Tên", value: user.firstName },
          { label: "Giới tính", value: user.gender ? Gender[user.gender] : null },
          {
            label: "Ngày sinh",
            value: user.dob ? formatDate(user.dob) : null,
          },
        ]}
      />

      <InfoCard
        title="Thông tin học vấn"
        icon={<GraduationCap className="h-3 w-3" />}
        items={[
          {
            label: "Khoa",
            value: user.department ? Department[user.department] : null,
          },
          { label: "Mã người dùng", value: user.code },
        ]}
      />
    </div>
  );
};

const AcademicInfoSection = ({ profile }: { profile?: ProfileStudent }) => {
  if (!profile) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <BookOpen className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
          <h3 className="text-sm font-medium text-muted-foreground">
            Không có thông tin học vấn
          </h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <InfoCard
        title="Học vấn"
        icon={<GraduationCap className="h-3 w-3" />}
        items={[
          { label: "Chuyên ngành", value: profile.specialty?.specialtyName },
          { label: "Học kỳ", value: profile.semester?.semesterName },
          { label: "Mã người dùng", value: profile.code },
          {
            label: "Đủ điều kiện dự án",
            value: profile.isQualifiedForAcademicProject
              ? "Đủ điều kiện"
              : "Không đủ",
            highlight: profile.isQualifiedForAcademicProject,
          },
        ]}
      />

      {profile.bio && (
        <InfoCard
          title="Giới thiệu"
          icon={<FileText className="h-3 w-3" />}
          content={<p className="text-xs whitespace-pre-line">{profile.bio}</p>}
        />
      )}

      {profile.skillProfiles?.length > 0 && (
        <InfoCard
          title="Kỹ năng"
          icon={<Briefcase className="h-3 w-3" />}
          content={
            <div className="flex flex-wrap gap-1">
              {profile.skillProfiles.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs font-normal py-0.5 px-1.5">
                  {skill.fullSkill || `Kỹ năng ${index + 1}`}
                </Badge>
              ))}
            </div>
          }
        />
      )}

      {profile.achievement && (
        <InfoCard
          title="Thành tích"
          icon={<Award className="h-3 w-3" />}
          content={
            <p className="text-xs whitespace-pre-line">{profile.achievement}</p>
          }
        />
      )}

      {profile.experienceProject && (
        <InfoCard
          title="Kinh nghiệm dự án"
          icon={<Briefcase className="h-3 w-3" />}
          content={
            <p className="text-xs whitespace-pre-line">
              {profile.experienceProject}
            </p>
          }
        />
      )}

      {profile.interest && (
        <InfoCard
          title="Sở thích"
          icon={<Heart className="h-3 w-3" />}
          content={
            <p className="text-xs whitespace-pre-line">{profile.interest}</p>
          }
        />
      )}

      {profile.fileCv && (
        <InfoCard
          title="CV cá nhân"
          icon={<FileText className="h-3 w-3" />}
          content={
            <Button variant="outline" size="sm" asChild className="h-8">
              <a
                href={profile.fileCv}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs"
              >
                <FileText className="h-3 w-3" />
                Tải CV
              </a>
            </Button>
          }
        />
      )}
    </div>
  );
};

const ActivitiesSection = () => {
  return (
    <Card>
      <CardContent className="py-6 text-center">
        <Award className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
        <h3 className="text-sm font-medium text-muted-foreground">
          Hoạt động sẽ hiển thị tại đây
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Bài viết, dự án, ý tưởng và các hoạt động khác
        </p>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-1">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-xs leading-tight">{value}</p>
      </div>
    </div>
  );
};

const InfoCard = ({
  title,
  icon,
  items,
  content,
}: {
  title: string;
  icon?: React.ReactNode;
  items?: Array<{
    label: string;
    value: string | null | undefined;
    highlight?: boolean;
  }>;
  content?: React.ReactNode;
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-1">
          {icon}
          <CardTitle className="text-sm">{title}</CardTitle>
        </div>
      </CardHeader>

      <Separator className="my-1" />

      <CardContent className="pt-2">
        {content ? (
          content
        ) : (
          <div className="space-y-2">
            {items?.map(
              (item, index) =>
                item.value && (
                  <div key={index} className="grid grid-cols-3 gap-2">
                    <p className="text-xs text-muted-foreground col-span-1">
                      {item.label}
                    </p>
                    <p
                      className={`text-xs col-span-2 ${
                        item.highlight ? "font-medium text-primary" : ""
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto py-4 px-2 sm:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {/* Left Sidebar Skeleton */}
        <div className="lg:col-span-1 space-y-2">
          <Card>
            <CardHeader className="items-center pb-2 space-y-1">
              <Skeleton className="h-16 w-16 rounded-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-center gap-1">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
            </CardHeader>
            <Separator className="my-1" />
            <CardContent className="pt-2 space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <Skeleton className="h-3 w-1/3" />
            </CardHeader>
            <Separator className="my-1" />
            <CardContent className="pt-1 space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-3">
          <div className="flex space-x-1 mb-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-1/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-3 w-1/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-3 w-1/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};