// src/admin/widgets/order-receipt-widget.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types";
import {
  Container,
  Text,
} from "@medusajs/ui";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const OrderReceiptWidget = ({ data: order }: DetailWidgetProps<AdminOrder>) => {
  const { t } = useTranslation();
  const [imageFailed, setImageFailed] = useState(false);

  const receiptUrl = useMemo(() => {
    return (order.metadata?.receipt_url as string) || null;
  }, [order.metadata]);

  if (!receiptUrl) {
    return null;
  }

  return (
    <Container className="divide-y p-0">
      <div className="p-4">
        <Text size="small" weight="plus" className="mb-2">
          {t("order-receipt-widget.title", "Uploaded Receipt:")}
        </Text>
        
        {receiptUrl.endsWith(".pdf") ? (
          <a
            href={receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ui-fg-interactive hover:underline"
          >
            {t("order-receipt-widget.view-pdf", "View PDF Receipt")}
          </a>
        ) : (
          <>
            {!imageFailed ? (
              <img
                src={receiptUrl}
                alt={t("order-receipt-widget.alt-receipt", "Uploaded receipt")}
                className="max-w-full h-auto rounded border max-h-96 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  setImageFailed(true);
                }}
              />
            ) : (
              <Text size="small" className="text-ui-fg-muted italic">
                {t("order-receipt-widget.fallback-error", "Image failed to load")}
              </Text>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "order.details.side.after",
});

export default OrderReceiptWidget;
