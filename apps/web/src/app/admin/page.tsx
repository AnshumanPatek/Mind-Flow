import { AdminDashboard } from "@/components/AdminDashboard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-slate-500 hover:text-brand-600 rounded-xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Main App
            </Button>
          </Link>
        </div>
        <AdminDashboard />
      </div>
    </div>
  );
}
