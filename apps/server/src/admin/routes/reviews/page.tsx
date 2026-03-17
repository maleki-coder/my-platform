// src/admin/routes/reviews/page.tsx
import { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Table,
  Badge,
  DropdownMenu,
  IconButton,
  Text,
} from "@medusajs/ui";
import { sdk } from "../../lib/sdk";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  ChatBubbleLeftRightSolid,
  EllipsisHorizontal,
  CheckCircleSolid,
  Trash,
} from "@medusajs/icons";

// ۱. تعریف ساختار داده
type ProductReview = {
  id: string;
  product_id: string;
  customer_id: string;
  product_name?: string;
  customer_name?: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
};

type ReviewsResponse = {
  reviews: ProductReview[];
};

export default function ProductReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ۲. دریافت اطلاعات از API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await sdk.client.fetch<ReviewsResponse>(
          "/admin/product-reviews",
          {
            method: "GET",
          },
        );
        setReviews(data.reviews);
      } catch (error) {
        console.error("خطا در دریافت نظرات:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // ۳. اکشن تایید نظر
  const handleApprove = async (id: string) => {
    try {
      await sdk.client.fetch(`/admin/product-reviews/${id}/approve`, {
        method: "POST",
      });

      // آپدیت وضعیت در رابط کاربری
      setReviews(
        reviews.map((r) => (r.id === id ? { ...r, is_approved: true } : r)),
      );
    } catch (error) {
      console.error("خطا در تایید نظر:", error);
    }
  };

  const handleDelete = async (id: string) => {
    // تاییدیه گرفتن از کاربر قبل از حذف (جلوگیری از خطای انسانی)
    if (!window.confirm("آیا از حذف دائمی این نظر اطمینان دارید؟")) return;

    try {
      // ارسال درخواست DELETE به مسیر جدیدی که ساختیم
      await sdk.client.fetch(`/admin/product-reviews/${id}/delete`, {
        method: "DELETE",
      });

      // به‌روزرسانی State و حذف ردیف مورد نظر از جدول بدون نیاز به رفرش صفحه
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id),
      );
    } catch (error) {
      console.error("خطا در حذف نظر:", error);
      alert("حذف نظر با شکست مواجه شد. لطفا دوباره تلاش کنید.");
    }
  };

  return (
    <Container className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border-base">
        <div>
          <Heading level="h1" className="text-ui-fg-base">
            نظرات کاربران
          </Heading>
          <Text className="text-ui-fg-subtle text-sm mt-1">
            مدیریت و بررسی امتیازات ثبت شده برای محصولات
          </Text>
        </div>
      </div>

      {/* کانتینر با اسکرول افقی */}
      <div className="w-full overflow-x-auto relative">
        <Table>
          <Table.Header>
            <Table.Row>
              {/* ستون اول: هدر ثابت (Sticky Header) */}
              <Table.HeaderCell className="sticky left-0 bg-ui-bg-subtle border-ui-border-base whitespace-nowrap px-6">
                محصول
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap px-6">
                مشتری
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap text-center px-6">
                امتیاز
              </Table.HeaderCell>
              <Table.HeaderCell className="min-w-62.5 px-6">
                نظر
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap px-6 ">
                وضعیت
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap w-12.5 px-6"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell className="text-center py-8 text-ui-fg-subtle">
                  در حال دریافت اطلاعات...
                </Table.Cell>
              </Table.Row>
            ) : reviews.length === 0 ? (
              <Table.Row>
                <Table.Cell className="text-center py-8 text-ui-fg-subtle">
                  تا کنون نظری ثبت نشده است.
                </Table.Cell>
              </Table.Row>
            ) : (
              reviews.map((review) => (
                <Table.Row key={review.id}>
                  {/* ستون اول: سلول ثابت (Sticky Cell) با پس‌زمینه و حاشیه */}
                  <Table.Cell className="sticky left-0 bg-ui-bg-base border-ui-border-base font-medium text-ui-fg-base whitespace-nowrap px-6 shadow-[1px_0_0_0_var(--borders-base)]">
                    {review.product_name}
                  </Table.Cell>

                  {/* سایر ستون‌ها (اسکرول شونده) */}
                  <Table.Cell className="whitespace-nowrap text-ui-fg-subtle px-6">
                    {review.customer_name}
                  </Table.Cell>
                  <Table.Cell className="text-center font-medium whitespace-nowrap px-6">
                    {review.rating} / 5
                  </Table.Cell>
                  <Table.Cell className="text-ui-fg-subtle px-6">
                    <div className="truncate max-w-xs" title={review.comment}>
                      {review.comment}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap px-6">
                    {review.is_approved ? (
                      <Badge color="green" size="small">
                        تایید شده
                      </Badge>
                    ) : (
                      <Badge color="orange" size="small">
                        در انتظار تایید
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap flex justify-end px-6 items-center">
                    <DropdownMenu>
                      <DropdownMenu.Trigger asChild>
                        <IconButton variant="transparent" size="small">
                          <EllipsisHorizontal className="text-ui-fg-subtle" />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content align="end">
                        {!review.is_approved && (
                          <DropdownMenu.Item
                            onClick={() => handleApprove(review.id)}
                            className="gap-x-2"
                          >
                            <CheckCircleSolid className="text-ui-fg-subtle" />
                            تایید نظر
                          </DropdownMenu.Item>
                        )}
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                          onClick={() => handleDelete(review.id)}
                          className="gap-x-2 text-ui-fg-error"
                        >
                          <Trash className="text-ui-fg-error" />
                          حذف نظر
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>
    </Container>
  );
}

// تنظیمات مسیر منو (آیکون به ChatBubbleLeftRight تغییر یافت تا معنایی‌تر باشد)
export const config = defineRouteConfig({
  label: "نظرات کاربران",
  icon: ChatBubbleLeftRightSolid,
});
