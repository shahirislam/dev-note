import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "./button"

const fabVariants = cva(
  "fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 z-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface FabProps
  extends ButtonProps,
    VariantProps<typeof fabVariants> {}

const Fab = React.forwardRef<HTMLButtonElement, FabProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        className={cn(fabVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Fab.displayName = "Fab"

export { Fab, fabVariants }
