// app/_components/layout/Container.tsx
interface HeaderIconBoxProps {
    children: React.ReactNode;
    className?: string;
}

export default function HeaderIconBox({ children, className = '' }: HeaderIconBoxProps) {
    return (
        <div className={`flex h-12 w-12 p-2 rounded-md shadow-[0_4px_14px_-3px_rgba(0,0,0,0.22)] cursor-pointer items-center justify-center ${className}`}>
            {children}
        </div>
    );
}