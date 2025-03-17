import { useSelectorUser } from "@/hooks/use-auth";

export default function Layout({children}: {children: React.ReactNode}) {
    const user = useSelectorUser();
    return (
        <section>
            {children}
        </section>
    );
}