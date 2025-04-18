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
import { User } from "@/types/user";
import { UserXRole } from "@/types/user-x-role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schema validation
const formSchema = z.object({
  id: z.string().optional(),
  semesterId: z.string().min(1, "Name is required").optional().nullable(),
  userId: z.string().min(1, "Name is required"),
  roleId: z.string().min(1, "Name is required"),
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
      // Lấy thông tin user và các role đã gán
      const res_user = await userService.getById(params.userId.toString());
      if (res_user.status != 1) {
        toast.error(res_user.message);
        return;
      }

      const user = res_user.data ?? ({} as User);
      const userXRoles = user.userXRoles ?? [];

      // Kiểm tra nếu đang tạo/chỉnh sửa role primary
      if (values.isPrimary) {
        // Kiểm tra user đã có role primary chưa
        const hasExistingPrimary = userXRoles.some(
          (item) => item.isPrimary && item.id !== values.id
        );

        if (hasExistingPrimary) {
          toast.error("User đã có role primary, không thể tạo thêm");
          return;
        }
      } else {
        // Nếu không phải primary, kiểm tra user có ít nhất 1 role primary không
        const hasAnyPrimary = userXRoles.some(
          (item) => item.isPrimary && item.id !== values.id
        );

        if (!hasAnyPrimary) {
          toast.error("User cần có ít nhất 1 role primary");
          return;
        }

        if (!values.semesterId) {
          toast.error("Vui lòng chọn semester");
          return;
        }
      }

      // Thực hiện create/update
      if (userXRole) {
        // Edit mode
        const res = await userxroleService.update(values);
        if (res.status == 1) toast.success(res.message);
        else throw Error(res.message);
      } else {
        // Create mode
        const res = await userxroleService.create(values);
        if (res.status == 1) {
          toast.success(res.message);
        } else throw Error(res.message);
      }

      // queryClient.refetchQueries({ queryKey: ["data"] });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error as string);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {userXRole ? "Edit Assignment Role" : "Create New Assignment Role"}
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
              label="Select role"
              options={roles}
              selectValue={"id"}
              selectLabel={"roleName"}
              placeholder="Chọn vị trí"
            />
            <FormSwitch form={form} name="isPrimary" label="Chức năng" />

            {!isPrimary && (
              <FormSelectObject
                form={form}
                name="semesterId"
                label="Select semester"
                options={semesters}
                selectValue={"id"}
                selectLabel={"semesterName"}
                placeholder="Chọn kì"
              />
            )}

            <Button type="submit" className="w-full">
              {userXRole ? "Update" : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
