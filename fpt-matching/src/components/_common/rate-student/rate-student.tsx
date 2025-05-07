import { Modal, ModalBody, ModalClose, ModalContent, ModalFooter, ModalTrigger } from '@/components/ui/animated-modal';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/moving-border';
import { RootState } from '@/lib/redux/store';
import { rateService } from '@/services/rate-service';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Rating } from "@mui/material";
import { userService } from '@/services/user-service';
import { teammemberService } from '@/services/team-member-service';
import { RateCreateCommand } from '@/types/models/commands/rate/rate-create-command';
import { toast } from 'sonner';
import { ideaHistoryService } from '@/services/idea-history-service';
const RateStudent = ({ id, projectId }: { id: string, projectId: string }) => {
    const [rated, setRated] = React.useState(4);
    const [rated1, setRated1] = React.useState(4);
    const [rated2, setRated2] = React.useState(4);

    //gọi thông tin user đã đăng nhập
    const user = useSelector((state: RootState) => state.user.user)

    const { data: result } = useQuery({
        queryKey: ["getMemberById", id],
        queryFn: () => teammemberService.getById(id),
        refetchOnWindowFocus: false,
    });
    // const userisrated = result?.data?.find(x=>x.userId === id)

    // cập nhật giá trị numOfStar vào formData khi rated thay đổi
    React.useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            numbOfStar: Math.round((rated + rated1 + rated2) / 3 * 10) / 10,
        }));
    }, [rated, rated1, rated2]); // Chạy lại khi giá trị thay đổi

    // cập nhật id khi bấm vào đánh giá
    React.useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            rateForId: id,
        }));
    }, [id]); // chạy lại khi giá trị thay đổi

    const [formData, setFormData] = useState({
        rateById: user?.teamMembers.find(x => x.userId === user?.id)?.id ?? "", // hoặc x.id nếu đó là teamMemberId
        rateForId: id,
        numbOfStar: 1,
        content: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const handlSubmit = async () => {
        let query: RateCreateCommand = {
            rateById: formData.rateById ?? "",
            rateForId: formData.rateForId,
            percentContribution: formData.numbOfStar,
            content: formData.content
        }

        const result1 = await rateService.create(query)
        if (result1?.status == 1) {
            toast.success("Đã gửi form đánh giá đề tài thành công!")
            setFormData({
                rateById: user?.teamMembers.find(x => x.userId === user?.id)?.id ?? "", // hoặc x.id nếu đó là teamMemberId
                rateForId: id,
                numbOfStar: 1,
                content: ""
            })
            window.location.href = `/team/rate/${projectId}`;
        } else {
            toast.error("Đánh giá thất bại!")
        }



    }
    return (
        <div>
            {/* <div className="hidden" >{result?.data?.id}</div> */}
            {/* <Dialog> */}
            {/* <DialogTrigger asChild>
                    <span className="flex items-center mr-3">
                        <i className="fas fa-image text-red-500"></i>
                        <span className="ml-2"> Đánh giá </span>
                    </span>
                </DialogTrigger> */}
            {/* <DialogContent className="max-w-max min-w-[450px]"> */}
            {/* <DialogHeader>
                        <DialogTitle className="text-lg" >Form đánh giá</DialogTitle>
                        <DialogDescription className="text-base">
                            Đây là nơi bạn sẽ sẽ xem danh sách thành viên để đánh giá quá trình làm
                        </DialogDescription>
                    </DialogHeader> */}


            {/* Name Field */}
            {/* <div className="mb-4">
                        <label htmlFor="name" className="block mb-1">Tên người đánh giá</label>
                        <div
                            id="name"
                            className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >{user?.email}</div>
                    </div> */}

            {/* Email Field */}
            {/* <div className="mb-4">
                        <label htmlFor="email" className="block mb-1">Người nhận đánh giá</label>

                    </div> */}

            {/* Rating Field */}
            {/* <div className="mb-4">
                        <label className="block mb-1">Đánh giá</label>
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div key={num} className="flex items-center space-x-1">
                                    <input
                                        type="radio"
                                        name="rating"
                                        id={`rating${num}`}
                                        value={num}
                                        className="focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`rating${num}`}>{num}</label>
                                </div>
                            ))}
                        </div>
                    </div> */}

            {/* Message Field */}
            {/* <div className="mb-4">
                        <label htmlFor="message" className="block mb-1">Đóng góp ý kiến</label>
                        <textarea
                            id="message"
                            className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
 */}

            {/* <DialogFooter> */}
            {/* Submit Button */}
            {/* <button
                            type="submit"
                            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Submit
                        </button>
                        <Button type="cancel">Không, cảm ơn</Button> */}
            {/* </DialogFooter> */}
            {/* </DialogContent> */}
            {/* </Dialog> */}


            <Modal>
                <ModalTrigger className="px-0">
                    <button className='bg-orange-500 p-2 rounded-md' >Đánh giá</button>
                </ModalTrigger>

                <ModalBody className="min-h-[70%] max-h-[90%] min-w-[30%] md:max-w-[40%] overflow-auto">
                    <div className='flex flex-col items-center text-center bg-orange-500 p-3  shadow-lg w-full'>   {/* Title */}
                        <h2 className="text-2xl w-full font-bold text-white">Feedback Form</h2></div>
                    <ModalContent className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg w-full">


                        {/* Name Field */}
                        <div className="w-full mb-4 text-left">
                            <label htmlFor="name" className="block font-semibold mb-2">Tên người đánh giá:</label>
                            <div className="w-full min-h-14  py-2 px-4 rounded border border-orange-500 text-gray-500 font-sans bg-orange-50">
                                {user?.email}
                            </div>
                        </div>

                        {/* Recipient Field */}
                        <div className="w-full mb-4 text-left">
                            <label htmlFor="recipient" className="block  font-semibold mb-2">Người nhận đánh giá:</label>
                            <div className="w-full min-h-14 py-2 px-4 rounded border border-orange-500  text-gray-500 font-sans font-medium bg-orange-50">
                                {result?.data?.user?.email}
                            </div>
                        </div>

                        {/* Rating Field */}
                        <div className="w-full mb-4 text-left">
                            <label className="block  font-semibold mb-2">Đánh giá:</label>
                            <div className="flex items-center space-x-2  font-bold">

                                <Rating
                                    name="rating"
                                    value={rated}
                                    onChange={(event, value) => setRated(value ?? 1)}
                                    className="text-orange-500"
                                />
                                <span>{rated}</span>
                                <label className="block  font-semibold ">Teamworking</label>

                            </div>
                            <div className="flex items-center space-x-2  font-bold">

                                <Rating
                                    name="rating"
                                    value={rated1}
                                    onChange={(event, value) => setRated1(value ?? 1)}
                                    className="text-orange-500"
                                />
                                <span>{rated1}</span>
                                <label className="block  font-semibold ">Good knownledge/Skills</label>

                            </div>
                            <div className="flex items-center space-x-2  font-bold">

                                <Rating
                                    name="rating"
                                    value={rated2}
                                    onChange={(event, value) => setRated2(value ?? 1)}
                                    className="text-orange-500"
                                />
                                <span>{rated2}</span>
                                <label className="block font-semibold ">HardWorking</label>

                            </div>
                            <div className="block  font-semibold mt-2 "
                            >Tổng điểm: {(Math.round((rated + rated1 + rated2) / 3 * 10) / 10)}
                            </div>
                            {/* Nếu bạn cần lưu giá trị vào formData, hãy dùng input hidden */}
                            <input
                                type="hidden"
                                name="numbOfStar"
                                value={Math.round((rated + rated1 + rated2) / 3 * 10) / 10}
                                onChange={handleChange}
                            />

                        </div>

                        {/* Message Field */}
                        <div className="w-full mb-4 text-left">
                            <label htmlFor="message" className="block  font-semibold mb-2">Đóng góp ý kiến:</label>
                            <textarea
                                name='content'
                                className="w-full h-24 py-2 px-4 rounded border border-orange-500  focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50"
                                placeholder="Nhập ý kiến của bạn..."
                                value={formData.content}
                                onChange={handleChange}
                            ></textarea>
                        </div>


                    </ModalContent>
                    <ModalFooter className='text-base justify-end'>
                        <div className="flex space-x-2">

                            {/* Submit Button */}
                            <button onClick={() => handlSubmit()} className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition">
                                Gửi Feedback
                            </button>

                            <ModalClose className='px-4 py-2 bg-gray-300 text-black rounded-lg font-semibold hover:bg-gray-400 transition'>
                                Không, cảm ơn
                            </ModalClose>
                        </div>
                    </ModalFooter>

                </ModalBody>

            </Modal>
        </div>
    );
};

export default RateStudent;
