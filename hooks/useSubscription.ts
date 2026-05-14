"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function useSubscription(initialStatus = "FREE") {
  const { subscriptionStatus, setSubscriptionStatus } = useAppStore();

  useEffect(() => {
    setSubscriptionStatus(initialStatus);
  }, [initialStatus, setSubscriptionStatus]);

  return subscriptionStatus;
}
