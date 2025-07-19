"use client"

import * as React from "react"
import { Languages, Globe } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative w-9 h-9 rounded-lg hover:bg-accent/50 transition-colors duration-200"
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem 
          onClick={() => setLanguage("en")}
          className={`flex items-center gap-3 cursor-pointer transition-colors duration-200 ${
            language === "en" 
              ? "bg-primary/10 text-primary font-semibold" 
              : "hover:bg-accent/50"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium">English</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("bn")}
          className={`flex items-center gap-3 cursor-pointer transition-colors duration-200 ${
            language === "bn" 
              ? "bg-primary/10 text-primary font-semibold" 
              : "hover:bg-accent/50"
          }`}
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium">বাংলা</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 