"use client";

import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  FormInput,
  FormInputDateTimePicker,
  FormInputNumber,
  FormSelectObject,
  FormSwitch,
} from "@/lib/form-custom-shadcn";
import { roleService } from "@/services/role-service";
import { semesterService } from "@/services/semester-service";
import { userService } from "@/services/user-service";
import { userxroleService } from "@/services/user-x-role-service";
import { UserXRoleCreateCommand } from "@/types/models/commands/user-x-roles/user-x-role-create-command";
import { UserCreateCommand } from "@/types/models/commands/users/user-create-command";
import { User } from "@/types/user";
import { UserXRole } from "@/types/user-x-role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {Loader2} from "lucide-react";

const formSchema = z.object({
  id: z.string().optional(),
  semesterId: z.string().min(1, "Yêu cầu chọn học kỳ").optional().nullable(),
  userId: z.string().min(1, "Yêu cầu có người dùng"),
  roleId: z.string().min(1, "Yêu cầu chọn vai trò"),
  isPrimary: z.boolean().default(false),
});

interface UserXRoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userXRole?: UserXRole | null;
  onSuccess?: () => void;
}

export function UserXRoleFormDialog({
  open,
  onOpenChange,
  userXRole,
  onSuccess,
}: UserXRoleFormDialogProps) {
  const queryClient = useQueryClient();
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);

  const getDefaultValues = () => {
    if (userXRole) {
      return {
        ...userXRole,
      };
    }
    return {
      userId: params.userId as string,
    };
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  const isPrimary = form.watch("isPrimary");

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [open, userXRole]);

  useEffect(() => {
    if (isPrimary) {
      form.setValue("semesterId", null);
    }
  }, [isPrimary, form]);

  const [
    {
      data: res_roles,
      isLoading: isLoading1,
      isError: isError1,
      error: error1,
    },
    {
      data: res_semesters,
      isLoading: isLoading2,
      isError: isError2,
      error: error2,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: ["getall_role"],
        queryFn: async () => await roleService.getAll(),
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["getall_semester"],
        queryFn: async () => await semesterService.getAll(),
        refetchOnWindowFocus: false,
      },
    ],
  });

  if (isLoading1 || isLoading2) return <LoadingComponent />;
  if (isError1 || isError2) return <ErrorSystem />;

  const roles = res_roles?.data?.results ?? [];
  const semesters = res_semesters?.data?.results ?? [];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const res_user = await userService.getById(params.userId.toString());
      if (res_user.status != 1) {
        toast.error(res_user.message);
        return;
      }

      const user = res_user.data ?? ({} as User);
      const userXRoles = user.userXRoles ?? [];

      if (values.isPrimary) {
        const hasExistingPrimary = userXRoles.some(
          (item) => item.isPrimary && item.id !== values.id
        );

        if (hasExistingPrimary) {
          toast.error("Người dùng đã có vai trò chính, không thể thêm mới");
          return;
        }
      } else {
        const hasAnyPrimary = userXRoles.some(
          (item) => item.isPrimary && item.id !== values.id
        );

        // if (!hasAnyPrimary) {
        //   toast.error("Người dùng cần có ít nhất 1 vai trò chính");
        //   return;
        // }

        if (!values.semesterId) {
          toast.error("Vui lòng chọn học kỳ");
          return;
        }
      }

      if (userXRole) {
        const res = await userxroleService.update(values);
        if (res.status == 1) {
          toast.success(res.message);
          window.location.reload();
          return;
        }
        else {
          toast.error(res.message);
        };
      } else {
        const createCommand: UserXRoleCreateCommand = {
          userId: values.userId,
          roleId: values.roleId,
          isPrimary: values.isPrimary,
          semesterId: values.semesterId ?? undefined,
        };
        const res = await userxroleService.create(createCommand);
        if (res.status == 1) {
          toast.success(res.message);
          window.location.reload();
          return;
        } else {
          toast.error(res.message);
          return;
        };
      }

      onOpenChange(false);
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["getUserInfo"] });
    } catch (error) {
      toast.error(error as string);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {userXRole ? "Chỉnh sửa phân quyền" : "Thêm quyền mới"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit((values) => onSubmit(values))(e);
            }}
            className="space-y-4"
          >
            <FormSelectObject
              form={form}
              name="roleId"
              label="Vai trò"
              options={roles}
              selectValue={"id"}
              selectLabel={"roleName"}
              placeholder="Chọn vai trò"
              description="Chọn vai trò sẽ gán cho người dùng"
            />
            
            <FormSwitch 
              form={form} 
              name="isPrimary" 
              label="Vai trò chính" 
              description="Vai trò chính sẽ được áp dụng cho tất cả học kỳ"
            />

            {!isPrimary && (
              <FormSelectObject
                form={form}
                name="semesterId"
                label="Học kỳ áp dụng"
                options={semesters}
                selectValue={"id"}
                selectLabel={"semesterName"}
                placeholder="Chọn học kỳ"
                description="Chọn học kỳ mà vai trò này sẽ áp dụng"
              />
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
              >
                Hủy bỏ
              </Button>
              {loading ?
                  <Button disabled>
                    <Loader2 className="animate-spin"/>
                    Đang xử lí
                  </Button> :
                  <Button type="submit">
                    {userXRole ? "Cập nhật" : "Tạo mới"}
                  </Button>
              }
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}