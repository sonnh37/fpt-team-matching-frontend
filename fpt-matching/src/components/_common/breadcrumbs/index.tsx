import {usePathname} from "next/navigation";
import DynamicBreadcrumbs from "./dynamic-breadcrumbs";

export default function AutoBreadcrumb() {
    const pathname = usePathname();
    return (
        <div className="container mx-auto">
            {/* <Separator/> */}
            {pathname !== "/" && (
                <div className="flex justify-center items-center py-6">
                    
                    <DynamicBreadcrumbs/>
                </div>
            )}
        </div>
    );
}