import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ProfileBox from "@/components/ProfileBox";
import { BaseNextRequest } from "next/dist/server/base-http";
import TableTwo from "@/components/Tables/TableTwo";

export const metadata: Metadata = {
  title: "Next.js Profile Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Profile page for NextAdmin Dashboard Kit",
};

const Profile = () => {
  return (
    
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Beneficiaries" />

        <TableTwo />
      </div>
    
  );
};

export default Profile;
