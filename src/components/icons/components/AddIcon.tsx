import React from "react"
export const AddIcon = ({
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
    <svg width={size} height={size} viewBox="0 0 512 512" className={className}>
        <path
            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
            fill={color}
        />
    </svg>
)
