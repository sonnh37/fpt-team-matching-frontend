import React from 'react'
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const page = () => {
    const testimonials = [
        {
            quote:
                "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
            name: "Bùi Trần Thanh Thư",
            designation: "Nhóm trưởng",
            src: "/thuthanhbui.png",
        },
        {
            quote:
                "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
            name: "Cao Minh Quân",
            designation: "Front-end",
            src: "/quancao.png",
        },
        {
            quote:
                "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
            name: "Nguyễn Hoàng Sơn",
            designation: "Front-end ",
            src: "/nguyenhoangson.png",
        },
        {
            quote:
                "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
            name: "Lê Tấn Lộc",
            designation: "Back-end",
            src: "/letanloc.png",
        },

    ];

    return (
        <div>
            <div >
                <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-10 items-center justify-center ">
                        <div className="mt-12 md:mt-0">
                            <img src="/logo_web.png" alt="About Us Image" className="object-cover rounded-lg shadow-md w-[300px]"></img>
                        </div>
                        <div className="max-w-lg">
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Về chúng tôi</h2>
                            <p className="mt-4 text-gray-600 text-lg">
                                Các dự án Capstone là một phần thiết yếu trong hành trình học tập của sinh viên tại Đại học FPT, giúp họ áp dụng kiến ​​thức lý thuyết vào các tình huống thực tế và phát triển các kỹ năng làm việc nhóm. Việc tìm kiếm các thành viên nhóm phù hợp, đăng ký chủ đề dự án và quản lý tiến độ dự án hiện đang phải đối mặt với những thách thức đáng kể do thiếu một nền tảng tập trung. Sinh viên thường dựa vào các nhóm trò chuyện, phương tiện truyền thông xã hội hoặc giao tiếp trực tiếp, dẫn đến tình trạng kém hiệu quả và lãng phí thời gian.
                            </p>

                        </div>

                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-screen-sm text-center mb-4 lg:mb-6">
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Nhóm chúng tôi</h2>
            </div>
            <AnimatedTestimonials testimonials={testimonials} />
        </div>
    )
}

export default page
