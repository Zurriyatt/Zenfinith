"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { sendEmail } from "@/lib/email";
export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/orders/confirm?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Payment confirmed! Your order is now paid.");
        } else {
          toast.error("Could not confirm payment.");
        }
      });
      
  }, [sessionId]);

  return <div>Thank you for your order!</div>;
}