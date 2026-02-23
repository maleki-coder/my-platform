"use client"

import { convertToLocale } from "@lib/util/money"
import { ArrowUpMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Thumbnail from "@modules/products/components/thumbnail"
import { CalendarCheck, CreditCard, Mailbox } from "lucide-react"
import { useState } from "react"

type ReviewItemsProps = {
    cart: HttpTypes.StoreCart
}
const ReviewCartItem: React.FC<ReviewItemsProps> = ({
    cart
}) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const toggleDetails = () => {
        setIsDetailsOpen(!isDetailsOpen)
    }
    const sortedItems = cart?.items
        ? [...cart.items].sort((a, b) =>
            (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
        )
        : []

    return (
        <div className="pb-0 xl:pb-4 w-full">
            <div
                className=" border xl:border-2 border-gray-100 xl:bg-white rounded-lg px-4 xl:px-8 pt-4 xl:pt-0 pb-[18px] xl:pb-[26px] mb-4 xl:mb-6"
            >
                <div
                    className="xl:flex xl:items-center xl:justify-between xl:h-[78px] xl:pt-[26px] xl:pb-8 "
                >
                    <div
                        className="xl:flex xl:flex-col xl:flex-row xl:items-center xl:gap-[21px] xl:gap-[42px]"
                    >
                        <div className="flex flex-nowrap gap-2">
                            <Mailbox className="w-5 h-5" />
                            <p
                                className="flex items-center gap-2 text-primary-shade text-xs xl:text-sm font-semiBold"
                            >
                                {cart.shipping_methods![0].name}
                            </p>
                        </div>
                        <div className="text-xs flex gap-3 pt-3 xl:pt-0 items-center">
                            <div className="flex items-center gap-2">
                                <CalendarCheck className="w-5 h-5" />
                                <p className="flex ml-[18px] xl:ml-3 xl:text-sm font-medium">
                                    یک تا دو روز کاری
                                </p>
                            </div>
                            <div
                                className=" w-10 xl:w-[46px] h-[18px] xl:h-[22px] border border-gray-400 rounded-[4px] gap-1 flex items-center justify-center"
                            >
                                <span
                                    className="text-xs xl:text-xs font-medium text-gray-600 mt-[2px]"
                                >

                                    {cart.items?.length || 0}
                                </span>
                                <span>کالا</span>
                            </div>
                        </div>
                    </div>
                    <div
                        className=" pt-3 pb-[20px] xl:py-0 flex gap-[6px] xl:gap-2 items-center xl:items-start xl:items-center"
                    >
                        <CreditCard className="w-5 h-5" />
                        <p className=" text-xs xl:text-base text-gray-700 font-medium">
                            مجموع مبلغ محصولات :
                        </p>
                        <div
                            className="flex items-center gap-1 text-sm xl:text-lg text-gray-800 font-semiBold"
                        >
                            <span>

                                {convertToLocale({ amount: cart.item_total })}
                            </span>
                            <span className="text-primary-shade-1 text-xs font-medium mr-1  !text-xs !text-gray-700">تومان</span>
                        </div>
                    </div>
                </div>
                <div className=" bg-gray-200 h-[1px] w-[126px] xl:w-full !w-full"></div>

                {/* Order Details Section - Conditionally Rendered */}
                {isDetailsOpen && (
                    <div className=" w-full pt-[13px] lg:pt-5">
                        <header className=" flex justify-between w-full">
                            <span className=" flex gap-1 lg:gap-3">
                                <p className=" text-xs lg:text-sm font-medium text-gray-700">
                                    هزینه بسته بندی و ارسال:
                                </p>
                                <div className="flex items-center">
                                    <p
                                        className=" text-xs lg:text-base font-medium text-gray-700 "
                                    >
                                        {convertToLocale({ amount: cart.shipping_total })}
                                        < span className="text-primary-shade-1 text-xs font-medium mr-1  !text-xs !text-gray-700">تومان</span>
                                    </p>
                                </div>
                            </span>
                        </header>
                        <div
                            className="no-scrollbar scrollbar relative flex w-full mt-6 overflow-x-auto overflow-y-hidden"
                        >
                            {sortedItems.map((item, index) => (
                                <div key={index} className="w-40">
                                    <div className="flex w-full items-center p-6">
                                        <div className="relative flex w-full flex-col">
                                            <div className="relative">
                                                <Thumbnail
                                                    thumbnail={item.thumbnail}
                                                    images={item.variant?.product?.images}
                                                    size="square"
                                                />
                                            </div>
                                            <div className="w-full h-2.5 lg:h-5"></div>
                                            <div className="flex items-center justify-center gap-1 xl:gap-1.5">
                                                <div
                                                    className="flex items-center justify-center bg-white outline outline-1 outline-gray-300 h-6.5 w-6.5 rounded-md"
                                                >
                                                    <p
                                                        className="font-semiBold text-gray-700 text-smm leading-4"
                                                    >
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                                <div>
                                                    <div className="relative flex w-full items-center">
                                                        <div className="overflow-x-auto no-scrollbar">
                                                            <div
                                                                className="flex items-center scroll-smooth lg:pr-0"
                                                            >
                                                                <div
                                                                    className="flex items-center gap-2.5 w-fit flex-nowrap"
                                                                >
                                                                    <div>
                                                                        <div
                                                                            className="flex w-max items-center border p-[3px] h-5.5  lg:h-[26px]  rounded-[6px] border-gray-300 bg-white !border !border-gray-300 !bg-white !rounded-[6px] !text-gray-600 !text-xs "
                                                                        >
                                                                            <p
                                                                                className="mx-2 select-none whitespace-nowrap text-xs leading-5 font-medium text-gray-600"
                                                                            >
                                                                                {item.variant_title}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <span
                                                                    className="flex h-1 w-1 p-1 lg:h-0.5 lg:w-0.5 lg:p-0.5"
                                                                ></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Toggle Button */}
                <div className=" pt-[19px] xl:pt-6 flex justify-center">
                    <div
                        className="flex cursor-pointer items-center"
                        onClick={toggleDetails}
                    >
                        <p
                            className="text-xs font-semiBold text-primary-shade font-semiBold xl:font-medium xl:text-base "
                        >
                            {isDetailsOpen ? 'بستن جزئیات سفارش' : 'نمایش جزییات سفارش'}
                        </p>
                        <ArrowUpMini
                            className={`icon-arrow-${isDetailsOpen ? 'top' : 'bottom'} fill-primary-shade w-[18px] h-[18px] lg:w-6 lg:h-6 transition-transform duration-200`}
                            style={{ transform: isDetailsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        ></ArrowUpMini>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ReviewCartItem