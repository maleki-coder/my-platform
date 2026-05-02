// src/admin/routes/inquiries/page.tsx
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
  DocumentTextSolid,
  EllipsisHorizontal,
  Eye,
  CheckCircleSolid,
  Trash,
} from "@medusajs/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// 1. Data Structure Definition
type Inquiry = {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  status: "pending" | "reviewed" | "completed";
  created_at: string;
};

type InquiriesResponse = {
  inquiries: Inquiry[];
};

export default function B2BInquiriesPage() {
  const { t } = useTranslation("custom");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // 2. Fetch Data from API
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setIsLoading(true);
        const data = await sdk.client.fetch<InquiriesResponse>(
          "/admin/inquiries",
          { method: "GET" }
        );
        setInquiries(data.inquiries);
      } catch (error) {
        console.error(t("inquiries.errors.fetchError"), error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, [t]);

  // 3. Mark as Reviewed Action
  const handleMarkAsReviewed = async (id: string) => {
    try {
      await sdk.client.fetch(`/admin/inquiries/${id}/review`, {
        method: "POST",
      });
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: "reviewed" } : inq))
      );
    } catch (error) {
      console.error(t("inquiries.errors.reviewError"), error);
    }
  };

  // 4. Delete Action
  const handleDelete = async (id: string) => {
    if (!window.confirm(t("inquiries.confirmDelete"))) return;

    try {
      await sdk.client.fetch(`/admin/inquiries/${id}`, {
        method: "DELETE",
      });
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    } catch (error) {
      console.error(t("inquiries.errors.deleteError"), error);
      alert(t("inquiries.deleteFailedAlert"));
    }
  };

  // Date Formatter Helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  return (
    <Container className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border-base">
        <div>
          <Heading level="h1" className="text-ui-fg-base">
            {t("inquiries.title")}
          </Heading>
          <Text className="text-ui-fg-subtle text-sm mt-1">
            {t("inquiries.subtitle")}
          </Text>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="w-full overflow-x-auto relative">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="sticky text-right left-0 bg-ui-bg-subtle border-ui-border-base whitespace-nowrap px-6">
                {t("inquiries.table.requestId")}
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap text-right px-6">
                {t("inquiries.table.customer")}
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap text-right px-6">
                {t("inquiries.table.contact")}
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap text-right px-6">
                {t("inquiries.table.date")}
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap text-right px-6">
                {t("inquiries.table.status")}
              </Table.HeaderCell>
              <Table.HeaderCell className="whitespace-nowrap w-12.5 text-right px-6"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell className="text-center py-8 text-ui-fg-subtle">
                  {t("inquiries.loading")}
                </Table.Cell>
              </Table.Row>
            ) : inquiries.length === 0 ? (
              <Table.Row>
                <Table.Cell className="text-center py-8 text-ui-fg-subtle">
                  {t("inquiries.noData")}
                </Table.Cell>
              </Table.Row>
            ) : (
              inquiries.map((inquiry) => (
                <Table.Row key={inquiry.id}>
                  {/* Sticky ID Cell */}
                  <Table.Cell className="sticky left-0 bg-ui-bg-base border-ui-border-base font-medium text-ui-fg-base whitespace-nowrap px-6 shadow-[1px_0_0_0_var(--borders-base)] font-mono text-xs">
                    {inquiry.id.slice(-8).toUpperCase()}
                  </Table.Cell>

                  {/* Scrollable Columns */}
                  <Table.Cell className="whitespace-nowrap text-ui-fg-base px-6">
                    {inquiry.customer_name}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap px-6 flex flex-col gap-1">
                    <Text className="text-ui-fg-base text-sm">{inquiry.email}</Text>
                    <Text className="text-ui-fg-subtle text-xs font-mono">{inquiry.phone}</Text>
                  </Table.Cell>
                  <Table.Cell className="font-medium whitespace-nowrap px-6">
                    {formatDate(inquiry.created_at)}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap px-6">
                    {inquiry.status === "completed" ? (
                      <Badge color="green" size="small">{t("inquiries.status.completed")}</Badge>
                    ) : inquiry.status === "reviewed" ? (
                      <Badge color="blue" size="small">{t("inquiries.status.reviewed")}</Badge>
                    ) : (
                      <Badge color="orange" size="small">{t("inquiries.status.pending")}</Badge>
                    )}
                  </Table.Cell>
                  
                  {/* Actions Dropdown */}
                  <Table.Cell className="whitespace-nowrap flex justify-end px-6 items-center">
                    <DropdownMenu>
                      <DropdownMenu.Trigger asChild>
                        <IconButton variant="transparent" size="small">
                          <EllipsisHorizontal className="text-ui-fg-subtle" />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content align="end">
                        <DropdownMenu.Item
                          onClick={() => navigate(`/inquiries/${inquiry.id}`)}
                          className="gap-x-2"
                        >
                          <Eye className="text-ui-fg-subtle" />
                          {t("inquiries.actions.viewDetails")}
                        </DropdownMenu.Item>

                        {inquiry.status === "pending" && (
                          <DropdownMenu.Item
                            onClick={() => handleMarkAsReviewed(inquiry.id)}
                            className="gap-x-2"
                          >
                            <CheckCircleSolid className="text-ui-fg-subtle" />
                            {t("inquiries.actions.markReviewed")}
                          </DropdownMenu.Item>
                        )}
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                          onClick={() => handleDelete(inquiry.id)}
                          className="gap-x-2 text-ui-fg-error"
                        >
                          <Trash className="text-ui-fg-error" />
                          {t("inquiries.actions.delete")}
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

// Menu Route Configuration
export const config = defineRouteConfig({
  label: "inquiries.label",
  translationNs: "custom-inquiries",
  icon: DocumentTextSolid,
});
