// src/admin/widgets/order-receipt-widget.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types";
import {
  Container,
  Text,
} from "@medusajs/ui";
import { useMemo } from "react";

const OrderReceiptWidget = ({ data: order }: DetailWidgetProps<AdminOrder>) => {
  const receiptUrl = useMemo(() => {
    return (order.metadata?.receipt_url as string) || null;
  }, [order.metadata]);

  if (!receiptUrl) {
    return null; // Hide widget if no receipt
  }

  return (
    <Container className="divide-y p-0">
      <div className="p-4">
        <Text size="small" weight="plus" className="mb-2">
          Uploaded Receipt:
        </Text>
        {receiptUrl.endsWith(".pdf") ? (
          <a
            href={receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ui-fg-interactive hover:underline"
          >
            View PDF Receipt
          </a>
        ) : (
          <>
            <img
              src={receiptUrl}
              alt="Uploaded receipt"
              className="max-w-full h-auto rounded border max-h-96 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                // Fallback text if image fails
              }}
            />
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
