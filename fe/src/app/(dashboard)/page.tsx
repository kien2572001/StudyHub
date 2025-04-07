import Image from "next/image";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <div
        style={{
          height: "120vh",
          minHeight: 600,
        }}
      >
        <Image
          src="/images/illustrations/welcome.svg"
          alt="Welcome"
          width={500}
          height={500}
        />
      </div>
    </DashboardLayout>
  );
}
