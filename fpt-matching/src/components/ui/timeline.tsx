import {SemesterStatus} from "@/types/enums/semester";

const statuses = [
    { key: SemesterStatus.NotStarted, label: "Chưa bắt đầu" },
    { key: SemesterStatus.Preparing, label: "Chuẩn bị" },
    { key: SemesterStatus.OnGoing, label: "On Going" },
    { key: SemesterStatus.Closed, label: "Kết thúc" },
];

export default function SemesterStatusTimeline({
                                                   semester,
                                               }: {
    semester: { status: SemesterStatus };
}) {
    const currentIndex = semester.status;
    return (
        <section className="w-full max-w-4xl mx-auto py-8">
            <div className="space-y-6">
                <div className="relative flex items-center justify-between h-12">
                    <div className="absolute inset-x-0 top-2 h-1 bg-gray-200 dark:bg-gray-700" />
                    <div
                        className="absolute top-2 h-1 bg-orange-500 transition-all duration-300"
                        style={{
                            left: 0,
                            width: `${(currentIndex / (statuses.length - (currentIndex == 1 ? 1.25 : 1))) * 100}%`,
                        }}
                    />
                    <div className="relative flex justify-between w-full">
                        {statuses.map((status, index) => {
                            const isCompleted = index < currentIndex;
                            const isCurrent = index === currentIndex;

                            return (
                                <div key={status.key} className="flex flex-col items-center">
                                    <div
                                        className={`w-6 h-6 rounded-full transition-all duration-300 ${
                                            isCompleted || isCurrent
                                                ? "bg-orange-500"
                                                : "bg-gray-900 dark:bg-gray-50"
                                        } ${status.key == SemesterStatus.NotStarted && "self-start"} ${status.key == SemesterStatus.Closed && "self-end"}`}
                                    />
                                    <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        {status.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
