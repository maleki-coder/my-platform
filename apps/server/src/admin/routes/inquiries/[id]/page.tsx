// src/admin/routes/inquiries/[id]/page.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Heading, Text, Table, Badge, Button } from "@medusajs/ui";
import { sdk } from "../../../lib/sdk";
import { ArrowLeft } from "@medusajs/icons";
import { useTranslation } from "react-i18next";

// 1. Extended Data Structure for Details
type BOMItem = {
  id: string;
  part_number: string;
  quantity: number;
  target_price?: string | null;
  datasheet_url?: string | null;
  thumbnail?: string | null;
  currency?: string | null;
  package?: string | null;
  brand?: string | null;
  link?: string | null;
  description?: string | null;
};

type InquiryDetails = {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  notes: string;
  status: "pending" | "reviewed" | "completed";
  created_at: string;
  items: BOMItem[]; // Array of parts uploaded by customer
};

type InquiryResponse = {
  inquiry: InquiryDetails;
};

export default function InquiryDetailsPage() {
  const { t } = useTranslation("custom");
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<InquiryDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 2. Fetch specific inquiry data
  useEffect(() => {
    const fetchInquiryDetails = async () => {
      try {
        setIsLoading(true);
        const data = await sdk.client.fetch<InquiryResponse>(
          `/admin/inquiries/${id}`,
          { method: "GET" },
        );
        setInquiry(data.inquiry);
      } catch (error) {
        console.error(t("inquiryDetails.errors.fetchError"), error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchInquiryDetails();
  }, [id, t]);

  if (isLoading) {
    return (
      <Container className="p-6 flex items-center justify-center min-h-50">
        <Text className="text-ui-fg-subtle">{t("inquiryDetails.loading")}</Text>
      </Container>
    );
  }

  if (!inquiry) {
    return (
      <Container className="p-6">
        <Text className="text-ui-fg-error">{t("inquiryDetails.notFound")}</Text>
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          {t("inquiryDetails.backButton")}
        </Button>
      </Container>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* Back Button */}
      <Button
        variant="transparent"
        size="small"
        onClick={() => navigate(-1)}
        className="self-start text-ui-fg-subtle hover:text-ui-fg-base"
      >
        <ArrowLeft className="mr-2 ml-2" />
        {t("inquiryDetails.backToList")}
      </Button>

      {/* Overview Container */}
      <Container className="p-6 flex flex-col gap-y-6">
        <div className="flex justify-between items-start border-b border-ui-border-base pb-4">
          <div>
            <Heading level="h1" className="text-ui-fg-base">
              {t("inquiryDetails.title")}
            </Heading>
            <Text className="text-ui-fg-subtle font-mono text-xs mt-2 uppercase">
              {t("inquiryDetails.idLabel")}: {inquiry.id}
            </Text>
          </div>
          <Badge
            color={
              inquiry.status === "completed"
                ? "green"
                : inquiry.status === "reviewed"
                  ? "blue"
                  : "orange"
            }
            size="large"
          >
            {inquiry.status === "completed"
              ? t("inquiryDetails.status.completed")
              : inquiry.status === "reviewed"
                ? t("inquiryDetails.status.reviewed")
                : t("inquiryDetails.status.pending")}
          </Badge>
        </div>

        {/* Customer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-y-1">
            <Text className="text-ui-fg-subtle text-xs font-medium">
              {t("inquiryDetails.customerInfo.name")}
            </Text>
            <Text className="text-ui-fg-base">{inquiry.customer_name}</Text>
          </div>
          <div className="flex flex-col gap-y-1">
            <Text className="text-ui-fg-subtle text-xs font-medium">
              {t("inquiryDetails.customerInfo.email")}
            </Text>
            <Text className="text-ui-fg-base">
              {inquiry.email}
            </Text>
          </div>
          <div className="flex flex-col gap-y-1">
            <Text className="text-ui-fg-subtle text-xs font-medium">
              {t("inquiryDetails.customerInfo.phone")}
            </Text>
            <Text className="text-ui-fg-base font-mono">{inquiry.phone}</Text>
          </div>

          {/* Notes Section spanning all columns */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-y-2 mt-2 border-t border-ui-border-base pt-4">
            <Text className="text-ui-fg-subtle text-xs font-medium">
              {t("inquiryDetails.customerInfo.notes")}
            </Text>
            <div className="bg-ui-bg-subtle p-4 rounded-lg border border-ui-border-base">
              <Text className="text-ui-fg-base whitespace-pre-wrap">
                {inquiry.notes || t("inquiryDetails.customerInfo.noNotes")}
              </Text>
            </div>
          </div>
        </div>
      </Container>

      {/* BOM Items Table Container */}
      <Container className="p-0 overflow-hidden mt-2">
        <div className="px-6 py-4 border-b border-ui-border-base">
          <Heading level="h2" className="text-ui-fg-base">
            {t("inquiryDetails.bomTable.title")}
          </Heading>
          <Text className="text-ui-fg-subtle text-sm mt-1">
            {t("inquiryDetails.bomTable.total")}: {inquiry.items?.length || 0} {t("inquiryDetails.bomTable.parts")}
          </Text>
        </div>

        <div className="w-full overflow-x-auto relative">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="sticky right-0 bg-ui-bg-subtle border-ui-border-base px-6 whitespace-nowrap text-center">
                  {t("inquiryDetails.bomTable.columns.partNumber")}
                </Table.HeaderCell>
                <Table.HeaderCell className="px-6 whitespace-nowrap text-center">
                  {t("inquiryDetails.bomTable.columns.quantity")}
                </Table.HeaderCell>
                <Table.HeaderCell className="px-6 whitespace-nowrap text-center">
                  {t("inquiryDetails.bomTable.columns.targetPrice")}
                </Table.HeaderCell>
                <Table.HeaderCell className="px-6 whitespace-nowrap text-center">
                  {t("inquiryDetails.bomTable.columns.currency")}
                </Table.HeaderCell>
                <Table.HeaderCell className="px-6 whitespace-nowrap text-center">
                  {t("inquiryDetails.bomTable.columns.package")}
                </Table.HeaderCell>
                <Table.HeaderCell className="px-6 whitespace-nowrap text-center">
                  {t("inquiryDetails.bomTable.columns.brand")}
                </Table.HeaderCell>
                <Table.HeaderCell className="px-6 whitespace-nowrap text-center">
                  {t("inquiryDetails.bomTable.columns.link")}
                </Table.HeaderCell>
                <Table.HeaderCell className="min-w-80 px-6 whitespace-nowrap text-center">
                  {t("inquiryDetails.bomTable.columns.description")}
                </Table.HeaderCell>
                <Table.HeaderCell className="px-6 whitespace-nowrap text-center">
                  {t("inquiryDetails.bomTable.columns.image")}
                </Table.HeaderCell>
                <Table.HeaderCell className="px-6 whitespace-nowrap text-center">
                  {t("inquiryDetails.bomTable.columns.datasheet")}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {inquiry.items?.length === 0 ? (
                <Table.Row>
                  <Table.Cell className="text-center py-8 text-ui-fg-subtle">
                    {t("inquiryDetails.bomTable.noItems")}
                  </Table.Cell>
                </Table.Row>
              ) : (
                inquiry.items?.map((item, index) => (
                  <Table.Row key={item.id || index}>
                    <Table.Cell
                      className="sticky right-0 bg-ui-bg-base border-ui-border-base font-bold text-ui-fg-base px-6 shadow-[1px_0_0_0_var(--borders-base)] whitespace-nowrap"
                      dir="ltr"
                    >
                      {item.part_number}
                    </Table.Cell>
                    <Table.Cell className="px-6 text-center font-medium">
                      {item.quantity}
                    </Table.Cell>
                    <Table.Cell
                      className="px-6 text-center text-ui-fg-subtle font-mono"
                      dir="ltr"
                    >
                      {item.target_price ? `${item.target_price}` : "-"}
                    </Table.Cell>
                    <Table.Cell
                      className="px-6 text-center text-ui-fg-subtle font-mono"
                      dir="ltr"
                    >
                      {item.currency ? `${item.currency}` : "-"}
                    </Table.Cell>
                    <Table.Cell
                      className="px-6 text-center text-ui-fg-subtle font-mono"
                      dir="ltr"
                    >
                      {item.package ? `${item.package}` : "-"}
                    </Table.Cell>
                    <Table.Cell
                      className="px-6 text-center text-ui-fg-subtle font-mono"
                      dir="ltr"
                    >
                      {item.brand ? `${item.brand}` : "-"}
                    </Table.Cell>
                    <Table.Cell
                      className="px-6 text-center text-ui-fg-subtle font-mono"
                      dir="ltr"
                    >
                      {item.link ? (
                        <a
                          // Clever fallback to ensure routing works perfectly even if the user forgot 'https://'
                          href={
                            item.link.startsWith("http")
                              ? item.link
                              : `https://${item.link}`
                          }
                          target="_blank"
                          rel="noreferrer noopener" // Security best practice for external tabs!
                          className="text-blue-500 hover:text-blue-700 underline transition-colors duration-200"
                        >
                          {t("inquiryDetails.bomTable.viewLink")}
                        </a>
                      ) : (
                        "-"
                      )}
                    </Table.Cell>
                    <Table.Cell
                      className="px-6 text-center text-ui-fg-subtle font-mono"
                      dir="ltr"
                    >
                      {item.description ? (
                        <div
                          className="mx-auto text-sm whitespace-normal wrap-break-word line-clamp-3"
                          title={item.description} // Hovering shows the full text natively!
                        >
                          {item.description}
                        </div>
                      ) : (
                        "-"
                      )}
                    </Table.Cell>
                    <Table.Cell className="p-4 text-center">
                      {item.thumbnail ? (
                        <a
                          href={item.thumbnail}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-block" // Keeps the anchor tightly wrapping the image
                        >
                          <img
                            src={item.thumbnail}
                            alt={t("inquiryDetails.bomTable.imageAlt", { partNumber: item.part_number })}
                            className="w-10 h-10 min-w-10 min-h-10 object-cover rounded-md border border-ui-border-base shadow-sm hover:opacity-80 transition-opacity duration-200"
                            loading="lazy"
                          />
                        </a>
                      ) : (
                        <span className="text-ui-fg-subtle font-mono">-</span>
                      )}
                    </Table.Cell>
                    <Table.Cell className="px-6 whitespace-nowrap">
                      {item.datasheet_url ? (
                        <a
                          href={item.datasheet_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 hover:text-blue-700 underline text-sm"
                        >
                          {t("inquiryDetails.bomTable.downloadFile")}
                        </a>
                      ) : (
                        <Text className="text-ui-fg-subtle text-sm">
                          {t("inquiryDetails.bomTable.noFile")}
                        </Text>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </Container>
    </div>
  );
}
