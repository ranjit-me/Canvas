import { protectServer } from "@/features/auth/utils";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage() {
  await protectServer();

  return <DashboardContent />;
};
