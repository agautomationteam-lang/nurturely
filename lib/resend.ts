import { Resend } from "resend";
import { assertEnv } from "@/lib/utils";

let resend: Resend | null = null;

export function getResend() {
  if (!resend) {
    resend = new Resend(assertEnv("RESEND_API_KEY"));
  }
  return resend;
}
