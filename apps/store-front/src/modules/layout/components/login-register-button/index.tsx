import LocalizedClientLink from "@modules/common/components/localized-client-link"
interface HeaderIconBoxProps {
  className?: string
}

export default function LoginRegisterButton({
  className = "",
}: HeaderIconBoxProps) {
  return (
    <LocalizedClientLink href="/account" backTo data-testid="nav-account-link">
      <div className="w-32 flex justify-around items-center text-sm px-2 cursor-pointer">
        <span className="">ورود</span>
        <span>|</span>
        <span className="">ثبت نام</span>
      </div>
    </LocalizedClientLink>
  )
}
