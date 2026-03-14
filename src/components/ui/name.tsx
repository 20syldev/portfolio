interface NameProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Text with shine animation and hover underline effect.
 * Underline slides in from left on hover, slides out to right on mouse leave.
 */
export function Name({ children, className = "" }: NameProps) {
    return (
        <span
            className={`
                animate-shine relative
                after:content-[''] after:absolute after:bottom-[-2px] after:left-0
                after:w-full after:h-[2px] after:bg-current
                after:scale-x-0 after:origin-right
                after:transition-transform after:duration-300
                hover:after:scale-x-100 hover:after:origin-left
                ${className}
            `}
        >
            {children}
        </span>
    );
}