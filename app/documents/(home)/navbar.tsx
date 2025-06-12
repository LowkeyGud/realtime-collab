import Link from "next/link";
import { FaGithub } from "react-icons/fa";

import { links } from "@/config";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Layers } from "lucide-react";
import { SearchInput } from "./search-input";

export const Navbar = () => {
  return (
    <nav className="flex size-full items-center justify-between">
      <Link href="/" className="mr-6 transition-opacity hover:opacity-75">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Layers className="h-6 w-6" />
          <span>RealTime Collab</span>
        </div>
      </Link>

      <SearchInput />

      <div className="flex items-center gap-3 pl-6">
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"
        />

        <UserButton />

        <Link
          href={links.sourceCode}
          target="_blank"
          rel="noreferrer noopener"
          className="transition-opacity hover:opacity-75"
        >
          <FaGithub className="size-6" />
        </Link>
      </div>
    </nav>
  );
};
