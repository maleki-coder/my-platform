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
import { useTranslation } from "react-i18next";


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
  const { t } = useTranslation(); // <-- Initialized the translation hook

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


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
        console.error(t("reviews.fetchError"), error); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [t]);


  const handleApprove = async (id: string) => {
    try {
      await sdk.client.fetch(`/admin/product-reviews/${id}/approve`, {
        method: "POST",
      });

      setReviews(
        reviews.map((r) => (r.id === id ? { ...r, is_approved: true } : r)),
      );
    } catch (error) {
      console.error(t("reviews.approveError"), error); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("reviews.deleteConfirm"))) return; 

    try {

      await sdk.client.fetch(`/admin/product-reviews/${id}/delete`, {
        method: "DELETE",
      });


      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id),
      );
    } catch (error) {
      console.error(t("reviews.deleteError"), error); 
      alert(t("reviews.deleteAlert")); 
    }
  };

  return (
    <Container className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border-base">
        <div>
          <Heading level="h1" className="text-ui-fg-base">
            {t("reviews.pageTitle")} 
          </Heading>
          <Text className="text-ui-fg-subtle text-sm mt-1">
            {t("reviews.pageSubtitle")} 
          </Text>
        </div>
      </div>

      <div className="w-full overflow-x-auto relative">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="sticky text-right left-0 bg-ui-bg-subtle border-ui-border-base whitespace-nowrap px-6">
                {t("reviews.colProduct")} 
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap text-right px-6">
                {t("reviews.colCustomer")} 
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap text-right px-6">
                {t("reviews.colRating")} 
              </Table.HeaderCell>
              <Table.HeaderCell className="min-w-62.5 text-right px-6">
                {t("reviews.colComment")} 
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap text-right px-6 ">
                {t("reviews.colStatus")} 
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap w-12.5 text-right px-6"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell className="text-center py-8 text-ui-fg-subtle">
                  {t("reviews.loading")} 
                </Table.Cell>
              </Table.Row>
            ) : reviews.length === 0 ? (
              <Table.Row>
                <Table.Cell className="text-center py-8 text-ui-fg-subtle">
                  {t("reviews.emptyState")} 
                </Table.Cell>
              </Table.Row>
            ) : (
              reviews.map((review) => (
                <Table.Row key={review.id}>
                  <Table.Cell className="sticky left-0 bg-ui-bg-base border-ui-border-base font-medium text-ui-fg-base whitespace-nowrap px-6 shadow-[1px_0_0_0_var(--borders-base)]">
                    {review.product_name}
                  </Table.Cell>

                  <Table.Cell className="whitespace-nowrap text-ui-fg-subtle px-6">
                    {review.customer_name}
                  </Table.Cell>
                  <Table.Cell className="font-medium whitespace-nowrap px-6">
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
                        {t("reviews.statusApproved")} 
                      </Badge>
                    ) : (
                      <Badge color="orange" size="small">
                        {t("reviews.statusPending")} 
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
                            {t("reviews.actionApprove")} 
                          </DropdownMenu.Item>
                        )}
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                          onClick={() => handleDelete(review.id)}
                          className="gap-x-2 text-ui-fg-error"
                        >
                          <Trash className="text-ui-fg-error" />
                          {t("reviews.actionDelete")} 
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

export const config = defineRouteConfig({
  label: "reviews.label", 
  translationNs: "custom-reviews",
  icon: ChatBubbleLeftRightSolid,
});
