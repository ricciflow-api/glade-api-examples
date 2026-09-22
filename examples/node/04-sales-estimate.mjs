import { get } from "./glade-client.mjs";

const payload = await get("/api/amazon/product/sales", {
  asin: "B0D1XD1ZV3",
  domain: "US",
});

const product = payload.data.amazonProduct;
const estimate = product.salesEstimate;

if (estimate.status === "UNAVAILABLE") {
  console.log({
    requestedAsin: product.requestedAsin,
    resolvedAsin: product.resolvedAsin,
    status: estimate.status,
    reason: estimate.unavailableReason,
  });
} else {
  console.log({
    requestedAsin: product.requestedAsin,
    resolvedAsin: product.resolvedAsin,
    canonicalParentAsin: product.canonicalParentAsin,
    familyDeduplicationKey: product.familyDeduplicationKey,
    scope: product.scope,
    estimateType: estimate.estimateType,
    estimateScope: estimate.scope,
    weeklyUnitSales: estimate.weeklyUnitSales,
    monthlyUnitSales: estimate.monthlyUnitSales,
    annualUnitSales: estimate.annualUnitSales,
    dataFetchedAt: estimate.dataFetchedAt,
    estimatedAt: estimate.estimatedAt,
    sourceObservedAt: estimate.sourceObservedAt,
    modelVersion: estimate.methodology.modelVersion,
    independentlyCalibrated: estimate.methodology.independentlyCalibrated,
    historicalRevenueStatus: estimate.revenue.status,
  });
}
