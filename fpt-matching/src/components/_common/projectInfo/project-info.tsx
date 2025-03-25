import { projectService } from "@/services/project-service";
import { useQuery } from "@tanstack/react-query";

const ProjectInfo = ({ id }: { id: string }) => {
    const { data: result } = useQuery({
      queryKey: ["getBlogById", id],
      queryFn: () => projectService.fetchById(id),
      refetchOnWindowFocus: false,
    });
  
    return (
      <div>
        <div className="hidden" >{result?.data?.id }</div>
    
        <div>{result?.data?.teamName || "Hiện tại chưa có."}</div>
      </div>
    );
  };
  
  export default ProjectInfo;