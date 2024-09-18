import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableTwo from "@/components/Tables/TableTwo";

const Beneficiaries = () => {
  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Beneficiaries" />
      <TableTwo />
    </div>
  );
};

export default Beneficiaries;
