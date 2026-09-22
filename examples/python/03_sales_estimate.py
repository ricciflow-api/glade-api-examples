"""Fetch and safely interpret a Glade sales run-rate projection."""

from glade_client import get


payload = get(
    "/api/amazon/product/sales",
    {"asin": "B0D1XD1ZV3", "domain": "US"},
)
product = payload["data"]["amazonProduct"]
estimate = product["salesEstimate"]

if estimate["status"] == "UNAVAILABLE":
    print(
        {
            "requested_asin": product.get("requestedAsin"),
            "resolved_asin": product.get("resolvedAsin"),
            "status": estimate["status"],
            "reason": estimate.get("unavailableReason"),
        }
    )
else:
    print(
        {
            "requested_asin": product.get("requestedAsin"),
            "resolved_asin": product.get("resolvedAsin"),
            "canonical_parent_asin": product.get("canonicalParentAsin"),
            "family_deduplication_key": product.get("familyDeduplicationKey"),
            "scope": product["scope"],
            "estimate_type": estimate["estimateType"],
            "estimate_scope": estimate["scope"],
            "weekly_units": estimate.get("weeklyUnitSales"),
            "monthly_units": estimate.get("monthlyUnitSales"),
            "annual_units": estimate.get("annualUnitSales"),
            "data_fetched_at": estimate.get("dataFetchedAt"),
            "estimated_at": estimate.get("estimatedAt"),
            "source_observed_at": estimate.get("sourceObservedAt"),
            "model_version": estimate["methodology"]["modelVersion"],
            "independently_calibrated": estimate["methodology"][
                "independentlyCalibrated"
            ],
            "historical_revenue_status": estimate["revenue"]["status"],
        }
    )
