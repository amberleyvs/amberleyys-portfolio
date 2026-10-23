import { renderIcon } from "@/lib/og";

export const dynamic = "force-static";

export function GET() {
  return renderIcon(32);
}
