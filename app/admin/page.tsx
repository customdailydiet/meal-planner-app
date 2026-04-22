import { redirect } from "next/navigation";

/**
 * Admin root redirect
 * Automatically directs traffic from /admin to the primary dashboard
 */
export default function AdminRootPage() {
    redirect("/admin/dashboard");
}
