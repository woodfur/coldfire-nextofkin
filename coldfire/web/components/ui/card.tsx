import React from 'react'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className = '', children }: CardProps) {
  return <div className={`bg-white shadow-md rounded-lg ${className}`}>{children}</div>
}

export function CardHeader({ className = '', children }: CardProps) {
  return <div className={`p-6 border-b ${className}`}>{children}</div>
}

export function CardTitle({ className = '', children }: CardProps) {
  return <h3 className={`text-2xl font-semibold ${className}`}>{children}</h3>
}

export function CardDescription({ className = '', children }: CardProps) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
}

export function CardContent({ className = '', children }: CardProps) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export function CardFooter({ className = '', children }: CardProps) {
  return <div className={`p-6 border-t ${className}`}>{children}</div>
}