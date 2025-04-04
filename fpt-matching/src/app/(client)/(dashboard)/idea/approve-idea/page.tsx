"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import { useDispatch } from "react-redux";

import IdeaRequestApprovedByCouncilTable from "@/components/sites/idea/approval/council/approved";
import { IdeaRequestPendingByCouncilTable } from "@/components/sites/idea/approval/council/pending";
import IdeaRequestRejectedByCouncilTable from "@/components/sites/idea/approval/council/rejected";
import IdeaRequestApprovedByMentorTable from "@/components/sites/idea/approval/mentor/approved";
import {
  IdeaRequestPendingByMentorTable
} from "@/components/sites/idea/approval/mentor/pending";
import IdeaRequestRejectedByMentorTable from "@/components/sites/idea/approval/mentor/rejected";
import { useCurrentRole } from "@/hooks/use-current-role";
export default function Page() {
  const dispatch = useDispatch();

  // const {
  //   data: result,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["getIdeaByLecturer"],
  //   queryFn: ideaService.getIdeaByUser,
  //   refetchOnWindowFocus: false,
  // });

  // if (isLoading) return <LoadingPage />;
  // if (isError) {
  //   console.error("Error fetching:", error);
  //   return <ErrorSystem />;
  // }

  // //   if (result) {
  // //     if (result.status !== 1) {
  // //       // almost no has idea
  // //       return <TypographyP className="text-red-500 pl-4">You have not team yet</TypographyP>;
  // //     }
  // //   }

  // const ideas = result?.data ?? [];
  // const ideaPending =
  //   ideas.find((m) => m.status === IdeaStatus.Pending && !m.isDeleted) ??
  //   ({} as Idea);

  // const totalPending = ideas.filter(
  //   (m) => m.status === IdeaStatus.Pending && !m.isDeleted
  // ).length;
  // const ideaApproved =
  //   ideas.find((m) => m.status === IdeaStatus.Approved && !m.isDeleted) ??
  //   ({} as Idea);
  // const totalAprroved = ideas.filter(
  //   (m) => m.status === IdeaStatus.Approved && !m.isDeleted
  // ).length;
  // const ideaRejected =
  //   ideas.find((m) => m.status === IdeaStatus.Rejected && !m.isDeleted) ??
  //   ({} as Idea);

  // const totalRejected = ideas.filter(
  //   (m) => m.status === IdeaStatus.Rejected && !m.isDeleted
  // ).length;
  const tab_1 = "Pending";
  const tab_2 = "Approved";
  const tab_3 = "Rejected";

  const role = useCurrentRole();

  const isLecturer = role == "Lecturer";

  const isCouncil = role == "Council";

  return (
    <>
      {isLecturer && <ApproveByMentor />}

      {isCouncil && <ApproveByCouncil />}
    </>
  );
}

function ApproveByCouncil() {
  const tab_1 = "Pending";
  const tab_2 = "Approved";
  const tab_3 = "Rejected";
  return (
    <Tabs defaultValue={tab_1} className="w-full container mx-auto">
      <div className="flex justify-between">
        <TabsList>
          <TabsTrigger value={tab_1}>
            <span className="flex items-center gap-2">
              {tab_1}{" "}
              {/* {totalPending != 0 ? <Badge>{totalPending}</Badge> : null} */}
            </span>
          </TabsTrigger>
          <TabsTrigger value={tab_2}>
            <span className="flex items-center gap-2">
              {tab_2}{" "}
              {/* {totalAprroved != 0 ? <Badge>{totalAprroved}</Badge> : null} */}
            </span>
          </TabsTrigger>
          <TabsTrigger value={tab_3}>
            <span className="flex items-center gap-2">
              {tab_3}{" "}
              {/* {totalRejected != 0 ? <Badge>{totalRejected}</Badge> : null} */}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value={tab_1}>
        <IdeaRequestPendingByCouncilTable />
      </TabsContent>
      <TabsContent value={tab_2}>
        <IdeaRequestApprovedByCouncilTable />
      </TabsContent>
      <TabsContent value={tab_3}>
        <IdeaRequestRejectedByCouncilTable />
      </TabsContent>
    </Tabs>
  );
}

function ApproveByMentor() {
  const tab_1 = "Pending";
  const tab_2 = "Approved";
  const tab_3 = "Rejected";
  return (
    <Tabs defaultValue={tab_1} className="w-full container mx-auto">
      <div className="flex justify-between">
        <TabsList>
          <TabsTrigger value={tab_1}>
            <span className="flex items-center gap-2">
              {tab_1}{" "}
              {/* {totalPending != 0 ? <Badge>{totalPending}</Badge> : null} */}
            </span>
          </TabsTrigger>
          <TabsTrigger value={tab_2}>
            <span className="flex items-center gap-2">
              {tab_2}{" "}
              {/* {totalAprroved != 0 ? <Badge>{totalAprroved}</Badge> : null} */}
            </span>
          </TabsTrigger>
          <TabsTrigger value={tab_3}>
            <span className="flex items-center gap-2">
              {tab_3}{" "}
              {/* {totalRejected != 0 ? <Badge>{totalRejected}</Badge> : null} */}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value={tab_1}>
        <IdeaRequestPendingByMentorTable />
      </TabsContent>
      <TabsContent value={tab_2}>
        <IdeaRequestApprovedByMentorTable />
      </TabsContent>
      <TabsContent value={tab_3}>
        <IdeaRequestRejectedByMentorTable />
      </TabsContent>
    </Tabs>
  );
}
