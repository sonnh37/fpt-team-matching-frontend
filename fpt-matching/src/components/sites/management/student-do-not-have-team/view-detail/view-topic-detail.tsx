import { Button } from "@/components/ui/button"
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {Topic} from "@/types/topic";

interface ViewTopicDetailProps {
    topic: Topic
}

export function ViewTopicDetail({ topic }: ViewTopicDetailProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Xem chi tiết</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Chi tiết đề tài</DialogTitle>
                    <DialogDescription>
                        Thông tin đề tài
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {[
                        { label: "Vietnamese Name", value: topic.vietNameseName },
                        { label: "English Name", value: topic.englishName },
                        { label: "Abbreviation", value: topic.abbreviation },
                        { label: "Topic Code", value: topic.topicCode },
                        { label: "Enterprise Name", value: topic.enterpriseName },
                        { label: "Status", value: topic.status },
                    ].map(({ label, value }) => (
                        <div className="grid grid-cols-4 items-center gap-4" key={label}>
                            <Label className="text-right">{label}</Label>
                            <Input value={value || ""} readOnly className="col-span-3" />
                        </div>
                    ))}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Is Enterprise Topic</Label>
                        <Switch
                            checked={topic.isEnterpriseTopic}
                            disabled
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Description</Label>
                        <textarea
                            value={topic.description || ""}
                            readOnly
                            className="col-span-3 border rounded-md p-2"
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
