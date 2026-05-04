import { Container, Heading, Text, Switch, Table, toast } from "@medusajs/ui";
import { AdminProduct, AdminProductOption } from "@medusajs/framework/types";
import { defineWidgetConfig } from "@medusajs/admin-sdk";

// 1. We extend the native Medusa types to include our custom data model securely.
type ExtendedProductOption = AdminProductOption & {
  option_extension?: {
    is_main_character: boolean;
  };
};

type ExtendedProduct = AdminProduct & {
  options: ExtendedProductOption[];
};

type MainCharacterWidgetProps = {
  data: ExtendedProduct; // ← Changed from 'product' to 'data'
};

const MainCharacterWidget = ({ data }: MainCharacterWidgetProps) => {
  const product = data; // ← Extract product from data prop

  // 2. The refactored toggle handler with the exact correct route path
  const handleToggle = async (optionId: string, currentStatus: boolean) => {
    try {
      // Pointing exactly to your custom route structure: product-option/[id]/main
      const response = await fetch(`/admin/product-option/${optionId}/main`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_main_character: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the main character status!");
      }

      toast.success("Success! 🌟", {
        description: "The main character tag has been successfully updated.",
      });

      // Quick reload to refresh the product object and display the new state!
      // window.location.reload();
    } catch (error) {
      console.error("Error updating option:", error);
      toast.error("Oops! 🚨", {
        description: "Something went wrong while updating the option.",
      });
    }
  };

  // Add better debugging
  console.log("Widget data:", data);
  console.log("Product options:", product?.options);

  if (!product || !product.options || product.options.length === 0) {
    return (
      <Container className="p-6 mt-4">
        <Heading level="h2" className="mb-2">
          Main Character Options ✨
        </Heading>
        <Text className="text-ui-fg-subtle">
          No product options available. Add options to this product first.
        </Text>
      </Container>
    );
  }

  return (
    <Container className="p-6 mt-4">
      <Heading level="h2" className="mb-2">
        Main Character Options ✨
      </Heading>
      <Text className="mb-6 text-ui-fg-subtle">
        Select which option should be highlighted as the "Main Character" on the
        storefront.
      </Text>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Option Title</Table.HeaderCell>
            <Table.HeaderCell>Main Character Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {product.options.map((baseOption) => {
            const option = baseOption as ExtendedProductOption;
            // Safely evaluate the boolean status from our custom extension
            const isMainCharacter =
              !!option.option_extension?.is_main_character;

            return (
              <Table.Row key={option.id}>
                <Table.Cell className="font-medium text-ui-fg-base">
                  {option.title}
                </Table.Cell>
                <Table.Cell>
                  <Switch
                    checked={isMainCharacter}
                    onCheckedChange={() =>
                      handleToggle(option.id, isMainCharacter)
                    }
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

// 3. Injecting the widget right below the product details
export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default MainCharacterWidget;
