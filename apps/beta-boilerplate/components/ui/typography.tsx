'use client';

import React from "react"

interface TypographyProps {
    children: React.ReactNode
}

export function Paragraph({ children }: TypographyProps) {
    return (
        <p className="text-base/relaxed">{children}</p>
    )
}

export function Header1({ children }: TypographyProps) {
    return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {children}
        </h1>
    )
}

export function Header2({ children }: TypographyProps) {
    return (
        <h2 className="scroll-m-20 text-2xl/normal">
            {children}
        </h2>
    )
}

export function Header3({ children }: TypographyProps) {
    return (
        <h3 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-2xl">
            {children}
        </h3>
    )
}

export function Header4({ children }: TypographyProps) {
    return (
        <h4 className="text-lg">{children}</h4>
    )
}

export function Header5({ children }: TypographyProps) {
    return (
        <h5 className="text-2xs uppercase">{children}</h5>
    )
}