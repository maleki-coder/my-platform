import { useState, useEffect } from "react";
import { Container, Heading, Text, Switch, Table, toast } from "@medusajs/ui";
import { AdminProduct, AdminProductOption } from "@medusajs/framework/types";
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// 1. Types remain exactly as you perfectly defined them
type ExtendedProductOption = AdminProductOption & {
  option_extension?: {
    is_main_character: boolean;
  };
};

type ExtendedProduct = AdminProduct & {
  options: ExtendedProductOption[];
};

type MainCharacterWidgetProps = {
  data: ExtendedProduct;
};

const MainCharacterWidget = ({ data: product }: MainCharacterWidgetProps) => {
  // 2. 🚀 Introduce Local State for Instant Reactivity!
  // We map option IDs to their boolean status for $O(1)$ lookups.
  const [mainCharacterStates, setMainCharacterStates] = useState<Record<string, boolean>>({});

  // 3. Sync the injected data into our local state when the component mounts
  useEffect(() => {
    if (product?.options) {
      const initialStates: Record<string, boolean> = {};
      product.options.forEach((baseOption) => {
        const option = baseOption as ExtendedProductOption;
        initialStates[option.id] = !!option.option_extension?.is_main_character;
      });
      setMainCharacterStates(initialStates);
    }
  }, [product]);

  // 4. The Optimistic Toggle Handler
  const handleToggle = async (optionId: string, currentStatus: boolean) => {
    const targetStatus = !currentStatus;

    // 🔥 OPTIMISTIC UPDATE: Change the UI instantly before the API even finishes!
    setMainCharacterStates((prev) => ({
      ...prev,
      [optionId]: targetStatus,
    }));

    try {
      const response = await fetch(`/admin/product-option/${optionId}/main`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_main_character: targetStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the main character status!");
      }

      toast.success("Success! 🌟", {
        description: "The main character tag has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating option:", error);
      
      // 🚨 ROLLBACK: If the API fails, revert the switch back to its original state
      setMainCharacterStates((prev) => ({
        ...prev,
        [optionId]: currentStatus,
      }));

      toast.error("Oops! 🚨", {
        description: "Something went wrong while updating the option. Reverting.",
      });
    }
  };

  if (!product || !product.options || product.options.length === 0) {
    return (
      <Container className="p-6 mt-4">
        <Heading level="h2" className="mb-2">Main Character Options ✨</Heading>
        <Text className="text-ui-fg-subtle">No product options available.</Text>
      </Container>
    );
  }

  return (
    <Container className="p-6 mt-4">
      <Heading level="h2" className="mb-2">
        Main Character Options ✨
      </Heading>
      <Text className="mb-6 text-ui-fg-subtle">
        Select which option should be highlighted as the "Main Character" on the storefront.
      </Text>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Option Title</Table.HeaderCell>
            <Table.HeaderCell>Main Character Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {product.options.map((option) => {
            // Read from our local state map instead of the static prop!
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
