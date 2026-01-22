import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href="/dashboard">
      <div className="flex items-center justify-center hover:opacity-75 transition h-[68px] px-3">
        <Image
          src="/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="object-contain"
        />
      </div>
    </Link>
  );
};
