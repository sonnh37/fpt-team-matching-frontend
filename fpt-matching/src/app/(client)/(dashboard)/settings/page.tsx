"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/lib/redux/store";
import { getEnumLabel } from "@/lib/utils";
import { Role } from "@/types/user";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { ProfileForm } from "./profile-form";

export default function SettingsProfilePage() {
  const user = useSelector((state: RootState) => state.user.user);
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-row items-center gap-3">
          <h3 className="text-lg font-medium">Profile</h3>
          <Badge className="!rounded-2xl">
            {getEnumLabel(Role, user?.role!)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Last updated date:{" "}
          {user?.lastUpdatedDate
            ? format(new Date(user.lastUpdatedDate), "yyyy-MM-dd HH:mm:ss")
            : "No date available"}
        </p>
      </div>
      <Separator />
      <ProfileForm user={user ?? undefined} />{" "}
      {/* Pass user data to the form */}
    </div>
  );
}
