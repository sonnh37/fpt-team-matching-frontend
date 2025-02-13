"use client";
import {usePathname} from "next/navigation";
import DynamicBreadcrumbs from "./dynamic-breadcrumbs";

export default function AutoBreadcrumb() {
    const pathname = usePathname();
    return (
        <div className="bg-accent h-8">
            {/* <Separator/> */}
            <div className="container mx-auto flex h-full items-center">
            <DynamicBreadcrumbs/>
            </div>
        </div>
    );
}