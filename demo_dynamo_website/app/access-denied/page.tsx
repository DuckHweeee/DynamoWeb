import { ShieldX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldX className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page. 
          Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="space-y-4">
          <Link href="/tablet">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Go to Tablet Dashboard
            </Button>
          </Link>
          
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Login as Different User
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
