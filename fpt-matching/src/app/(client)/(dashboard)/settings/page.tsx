"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/lib/redux/store";
import { formatDate } from "@/lib/utils";
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
            {user?.userXRoles
              .map((element) => element.role?.roleName)
              .join(", ")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Updated date: {formatDate(user?.updatedDate)}
        </p>
      </div>
      <Separator />
      <ProfileForm user={user ?? undefined} />{" "}
      {/* Pass user data to the form */}
    </div>
  );
}
