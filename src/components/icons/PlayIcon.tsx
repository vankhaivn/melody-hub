import React from "react"
export const PlayIcon = ({
    size = 24,
    width,
    height,
    color = "currentColor",
    className,
}: {
    size?: number
    width?: number
    height?: number
    color?: string
    className?: string
}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.6935 15.8458L15.4137 13.059C16.1954 12.5974 16.1954 11.4026 15.4137 10.941L10.6935 8.15419C9.93371 7.70561 9 8.28947 9 9.21316V14.7868C9 15.7105 9.93371 16.2944 10.6935 15.8458Z"
            fill={color}
        />
    </svg>
)
