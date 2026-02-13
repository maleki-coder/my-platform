import { SearchSlashIcon } from "lucide-react";

interface Props {
  children: React.ReactNode;
  searchTerm: string;
  className?: string;
}

export default function PopOverContentSearchContainer({
  children,
  className = "",
  searchTerm,
}: Props) {
  return (
    <div className={`flex flex-col p-4 ${className}`}>
      <div className="text-xs border-b pb-4 border-primary h-8 flex flex-nowrap items-center justify-between">
        <div className="flex items-center">
          <span>
            <SearchSlashIcon color="gray" />
          </span>
          <span className="ms-2">جستجو برای</span>
          <span className="ms-2">{searchTerm}</span>
        </div>
        <div className="text-blue-300 font-bold cursor-pointer ">
          مشاهده همه نتایج
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
