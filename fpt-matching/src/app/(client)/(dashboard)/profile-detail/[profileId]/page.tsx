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
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  Home,
  Cake,
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
      <div className="container mx-auto py-4 text-center text-destructive text-lg">
        Lỗi: {error.message}
      </div>
    );
  if (!result)
    return (
      <div className="container mx-auto py-4 text-center text-lg">
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Left Column - Profile Card */}
      <div className="lg:col-span-1">
        <UserProfileCard user={user} />
      </div>

      {/* Main Content - Personal Info */}
      <div className="lg:col-span-3">
        <PersonalInfoSection user={user} />
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
      <CardHeader className="items-center pb-4 space-y-2">
        <Avatar className="h-24 w-24 mb-2 text-xl">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="font-medium">
            {initials || <UserIcon className="h-6 w-6" />}
          </AvatarFallback>
        </Avatar>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight">
            {fullName || "Không có tên"}
          </h2>
          <div className="flex justify-center gap-2">
            {user.department && (
              <Badge
                variant="secondary"
                className="text-sm font-normal px-2 py-1"
              >
                {Department[user.department]}
              </Badge>
            )}
            {user.code && (
              <Badge
                variant="outline"
                className="text-sm font-normal px-2 py-1"
              >
                {user.code}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="pt-4 space-y-3">
        <InfoItem
          icon={<Cake className="h-4 w-4" />}
          label="Ngày sinh"
          value={user.dob ? formatDate(user.dob) : "Không có"}
          largeText
        />
        <InfoItem
          icon={<UserIcon className="h-4 w-4" />}
          label="Giới tính"
          value={user.gender ? Gender[user.gender] : "Không có"}
          largeText
        />
        <InfoItem
          icon={<Mail className="h-4 w-4" />}
          label="Email"
          value={user.email || "Không có"}
          largeText
        />
        <InfoItem
          icon={<Phone className="h-4 w-4" />}
          label="Điện thoại"
          value={user.phone || "Không có"}
          largeText
        />
        <InfoItem
          icon={<Home className="h-4 w-4" />}
          label="Địa chỉ"
          value={user.address || "Không có"}
          largeText
        />
      </CardContent>
    </Card>
  );
};

const PersonalInfoSection = ({ user }: { user: User }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          <span>Thông tin cá nhân</span>
        </CardTitle>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <InfoField label="Họ" value={user.lastName} largeText />
          <InfoField label="Tên" value={user.firstName} largeText />
          <InfoField
            label="Giới tính"
            value={user.gender ? Gender[user.gender] : null}
            largeText
          />
        </div>

        <div className="space-y-4">
          <InfoField
            label="Ngày sinh"
            value={user.dob ? formatDate(user.dob) : null}
            largeText
          />
          <InfoField
            label="Khoa"
            value={user.department ? Department[user.department] : null}
            largeText
          />
          <InfoField label="Mã người dùng" value={user.code} largeText />
        </div>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
  largeText = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  largeText?: boolean;
}) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p
          className={`${
            largeText ? "text-sm" : "text-xs"
          } font-medium text-muted-foreground`}
        >
          {label}
        </p>
        <p className={`${largeText ? "text-base" : "text-xs"} leading-tight`}>
          {value}
        </p>
      </div>
    </div>
  );
};

const InfoField = ({
  label,
  value,
  largeText = false,
}: {
  label: string;
  value: string | null | undefined;
  largeText?: boolean;
}) => {
  if (!value) return null;

  return (
    <div>
      <p
        className={`${
          largeText ? "text-sm" : "text-xs"
        } font-medium text-muted-foreground`}
      >
        {label}
      </p>
      <p className={`${largeText ? "text-lg" : "text-sm"} font-normal`}>
        {value}
      </p>
    </div>
  );
};

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto py-4 px-2 sm:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="items-center pb-4 space-y-2">
              <Skeleton className="h-24 w-24 rounded-full mb-2" />
              <Skeleton className="h-6 w-3/4" />
              <div className="flex justify-center gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardHeader>
            <Separator className="my-2" />
            <CardContent className="pt-4 space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <Separator className="my-2" />
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
