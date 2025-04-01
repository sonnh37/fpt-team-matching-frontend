import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from '@/components/ui/animated-modal';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/moving-border';
import { RootState } from '@/lib/redux/store';
import { rateService } from '@/services/rate-service';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useSelector } from 'react-redux';


const RateStudent = ({ id }: { id: string }) => {

    //gọi thông tin user đã đăng nhập
    const user = useSelector((state: RootState) => state.user.user)
    const { data: result } = useQuery({
        queryKey: ["getBlogById", id],
        queryFn: () => rateService.fetchById(id),
        refetchOnWindowFocus: false,
    });

    return (
        <div>
            <div className="hidden" >{result?.data?.id}</div>
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
                <ModalTrigger className="=">
                    <button >Danh gia</button>
                </ModalTrigger>

                <ModalBody className="min-h-[80%] max-h-[90%] min-w-[30%] md:max-w-[40%] overflow-auto">
                    <ModalContent className='flex flex-col text-center' >
                     
                            <h2 className="text-2xl font-bold mb-4">Feedback Form</h2>
                            {/* Name Field */}
                            <div className="mb-4  text-base text-left">
                                <label htmlFor="name" className="block mb-1 ml-4">Tên người đánh giá</label>
                                <div
                                    id="name"
                                    className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4"
                                >{user?.email}</div>
                            </div>

                            {/* Email Field */}
                              <div className="mb-4  text-base text-left">
                                <label htmlFor="name" className="block mb-1 ml-4">Người nhận đánh giá</label>
                                <div
                                    id="name"
                                    className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4"
                                >{user?.email}</div>
                            </div>

                            {/* Rating Field */}
                            <div className="mb-4">
                                <label className="block text-left mb-1 ml-4">Đánh giá</label>
                                <div className="flex items-center space-x-2 ml-4">
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
                            </div>

                            {/* Message Field */}
                            <div className="mb-4">
                                <label htmlFor="message" className="block mb-1 text-left ml-4">Đóng góp ý kiến</label>
                                <textarea
                                    id="message"
                                    className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>
                     

                    </ModalContent>
                    <ModalFooter className='text-base'>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="py-2 px-2 bg-blue-500 text-white rounded hover:bg-blue-600 "
                        >
                            Submit
                        </button>
                        <Button type="cancel">Không, cảm ơn</Button>
                    </ModalFooter>
                </ModalBody>

            </Modal>
        </div>
    );
};

export default RateStudent;
