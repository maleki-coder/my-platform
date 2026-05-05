import { useState, useEffect } from "react";
import { Container, Heading, Text, Switch, Table, toast } from "@medusajs/ui";
import { AdminProduct, AdminProductOption } from "@medusajs/framework/types";
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// 1. Types
type ExtendedProductOption = AdminProductOption & {
  option_extension?: {
    is_main_character: boolean;
  };
};

type ExtendedProduct = AdminProduct & {
  options: ExtendedProductOption[];
};

type MainCharacterWidgetProps = {
  data: AdminProduct;
};

const MainCharacterWidget = ({ data: baseProduct }: MainCharacterWidgetProps) => {
  const { t } = useTranslation(); // 🚀 Initialize the translation hook
  const [mainCharacterStates, setMainCharacterStates] = useState<Record<string, boolean>>({});

  const { data: fetchedProduct, isLoading } = useQuery({
    queryKey: ["product-main-options", baseProduct.id],
    queryFn: async () => {
      const response = await fetch(`/admin/products/${baseProduct.id}/main-options`);
      if (!response.ok) throw new Error("Failed to fetch fresh option data");
      const json = await response.json();
      return json.product as ExtendedProduct;
    },
  });

  useEffect(() => {
    if (fetchedProduct?.options) {
      const initialStates: Record<string, boolean> = {};
      fetchedProduct.options.forEach((option: ExtendedProductOption) => {
        initialStates[option.id] = !!option.option_extension?.is_main_character;
      });
      setMainCharacterStates(initialStates);
    }
  }, [fetchedProduct]);

  const handleToggle = async (optionId: string, currentStatus: boolean) => {
    const targetStatus = !currentStatus;

    setMainCharacterStates((prev) => ({
      ...prev,
      [optionId]: targetStatus,
    }));

    try {
      const response = await fetch(`/admin/product-option/${optionId}/main`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_main_character: targetStatus }),
      });

      if (!response.ok) throw new Error("Failed to update!");

      toast.success(t("mainCharacter.toast.successTitle", "Success! 🌟"), {
        description: t("mainCharacter.toast.successDesc", "The main character tag has been successfully updated."),
      });
    } catch (error) {
      console.error("Error updating option:", error);
      setMainCharacterStates((prev) => ({
        ...prev,
        [optionId]: currentStatus,
      }));
      toast.error(t("mainCharacter.toast.errorTitle", "Oops! 🚨"), {
        description: t("mainCharacter.toast.errorDesc", "Something went wrong while updating. Reverting."),
      });
    }
  };

  if (isLoading) {
    return (
      <Container className="p-6 mt-4">
        <Text className="text-ui-fg-subtle animate-pulse">
          {t("mainCharacter.loading", "Summoning VIP data... ⏳")}
        </Text>
      </Container>
    );
  }

  if (!fetchedProduct || !fetchedProduct.options || fetchedProduct.options.length === 0) {
    return (
      <Container className="p-6 mt-4">
        <Heading level="h2" className="mb-2">
          {t("mainCharacter.heading", "Main Character Options ✨")}
        </Heading>
        <Text className="text-ui-fg-subtle">
          {t("mainCharacter.noOptions", "No product options available.")}
        </Text>
      </Container>
    );
  }

  return (
    <Container className="p-6 mt-4">
      <Heading level="h2" className="mb-2">
        {t("mainCharacter.heading", "Main Character Options ✨")}
      </Heading>
      <Text className="mb-6 text-ui-fg-subtle">
        {t("mainCharacter.description", "Select which option should be highlighted as the \"Main Character\" on the storefront.")}
      </Text>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t("mainCharacter.table.optionTitle", "Option Title")}</Table.HeaderCell>
            <Table.HeaderCell>{t("mainCharacter.table.status", "Main Character Status")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fetchedProduct.options.map((option) => {
            const isMainCharacter = !!mainCharacterStates[option.id];

            return (
              <Table.Row key={option.id}>
                <Table.Cell className="font-medium text-ui-fg-base">
                  {option.title}
                </Table.Cell>
                <Table.Cell>
                  <Switch
                    checked={isMainCharacter}
                    onCheckedChange={() => handleToggle(option.id, isMainCharacter)}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default MainCharacterWidget;
