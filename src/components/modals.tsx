"use client";

import { useState, useEffect } from "react";

import { SuccessModal } from "@/features/subscriptions/components/success-modal";
import { FailModal } from "@/features/subscriptions/components/fail-modal";
import { SubscriptionModal } from "@/features/subscriptions/components/subscription-modal";
import { LeadCaptureModal } from "@/features/leads/components/lead-capture-modal";

export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <FailModal />
      <SuccessModal />
      <SubscriptionModal />
      <LeadCaptureModal />
    </>
  );
};
