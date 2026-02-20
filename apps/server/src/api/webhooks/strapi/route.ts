import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { simpleHash, Modules } from "@medusajs/framework/utils";
import {
  handleStrapiWebhookWorkflow,
  WorkflowInput,
} from "../../../workflows/handle-strapi-webhook";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body = req.body as Record<string, unknown>;
  const logger = req.scope.resolve("logger");
  const cachingService = req.scope.resolve(Modules.CACHE);

  // Generate a hash of the webhook payload to detect duplicates
  const payloadHash = simpleHash(JSON.stringify(body));
  const cacheKey = `strapi-webhook:${payloadHash}`;

  // Check if we've already processed this webhook
  const alreadyProcessed = await cachingService.get(cacheKey);

  if (alreadyProcessed) {
    logger.debug(
      `Webhook already processed (hash: ${payloadHash}), skipping to prevent infinite loop`,
    );
    res.status(200).send("OK - Already processed");
    return;
  }

  if (body.event === "entry.update") {
    const entry = body.entry as Record<string, unknown>;
    const entityCacheKey = `strapi-update:${body.model}:${entry.medusaId}`;
    await cachingService.set(
      entityCacheKey,
      { status: "processing", timestamp: Date.now() },
       10,
    );

    await handleStrapiWebhookWorkflow(req.scope).run({
      input: {
        entry: body,
      } as WorkflowInput,
    });

    // Cache the hash to prevent reprocessing (TTL: 60 seconds)
    await cachingService.set(
      cacheKey,
      { status: "processed", timestamp: Date.now() },
       60,
    );
    logger.debug(`Webhook processed and cached (hash: ${payloadHash})`);
  }

  res.status(200).send("OK");
};

// import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
// import { simpleHash } from "@medusajs/framework/utils";
// import {
//   handleStrapiWebhookWorkflow,
//   WorkflowInput,
// } from "../../../workflows/handle-strapi-webhook";

// // DEV ONLY — in-memory idempotency
// const processedWebhookHashes = new Set<string>();

// export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
//   const body = req.body as Record<string, unknown>;
//   const logger = req.scope.resolve("logger");

//   // Generate hash to detect duplicate webhooks
//   const payloadHash = simpleHash(JSON.stringify(body));

//   // Check in-memory Set
//   if (processedWebhookHashes.has(payloadHash)) {
//     logger.debug(`Webhook already processed (hash: ${payloadHash}), skipping`);
//     return res.status(200).send("OK - Already processed");
//   }

//   if (body.event === "entry.update") {
//     // Mark as processed BEFORE running workflow
//     // This prevents re-entrancy loops
//     processedWebhookHashes.add(payloadHash);

//     try {
//       await handleStrapiWebhookWorkflow(req.scope).run({
//         input: {
//           entry: body,
//         } as WorkflowInput,
//       });

//       logger.debug(`Webhook processed successfully (hash: ${payloadHash})`);
//     } catch (error) {
//       // Roll back so retries can happen in dev
//       processedWebhookHashes.delete(payloadHash);

//       logger.error(`Failed to process webhook (hash: ${payloadHash})`, error);

//       throw error;
//     }
//   }

//   res.status(200).send("OK");
// };
