import { cn } from '../../utils/cn';

export const Badge = ({ children, variant = 'gray', className, ...props }) => {
    const variants = {
        red: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
        yellow: "bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20",
        green: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
        blue: "bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-700/10",
        gray: "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10",
    };

    return (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", variants[variant], className)} {...props}>
            {children}
        </span>
    );
};
