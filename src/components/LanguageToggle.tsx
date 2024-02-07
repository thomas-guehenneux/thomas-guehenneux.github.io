import { As } from '@kobalte/core'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Locales } from '@/types/i18n'
import { navigate } from 'astro:transitions/client'
import { Languages } from 'lucide-solid'

export function LanguageToggle(props: {
  jaPath: string
  enPath: string
  availableLocales: Locales[]
  lang: Locales
  enTopPath: string
  jaTopPath: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <As component={Button} variant="ghost" size="sm" class="w-9 px-0">
          <Languages class="transition" />
          <span class="sr-only">Toggle language</span>
        </As>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() => navigate(props.availableLocales.includes('en') ? props.enPath : props.enTopPath)}
        >
          <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => navigate(props.availableLocales.includes('ja') ? props.jaPath : props.jaTopPath)}
        >
          <span>Japanese</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
