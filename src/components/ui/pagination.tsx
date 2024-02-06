import type { Component, ComponentProps } from 'solid-js'
import { mergeProps, splitProps } from 'solid-js'

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-solid'

import { buttonVariants, type ButtonProps } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const Pagination: Component<ComponentProps<'nav'>> = (props) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      class={cn('mx-auto flex w-full justify-center', props.class)}
      {...rest}
    />
  )
}

const PaginationContent: Component<ComponentProps<'ul'>> = (props) => {
  const [, rest] = splitProps(props, ['class'])
  return <ul class={cn('flex flex-row items-center gap-1', props.class)} {...rest} />
}

const PaginationItem: Component<ComponentProps<'li'>> = (props) => {
  const [, rest] = splitProps(props, ['class'])
  return <li class={cn('', props.class)} {...rest} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  ComponentProps<'a'>

const PaginationLink: Component<PaginationLinkProps> = (props) => {
  const mergedProps = mergeProps({ size: 'icon' } as PaginationLinkProps, props)
  const [, rest] = splitProps(mergedProps, ['class', 'isActive', 'size'])
  return (
    <PaginationItem>
      <a
        aria-current={props.isActive ? 'page' : undefined}
        class={cn(
          buttonVariants({
            variant: mergedProps.isActive ? 'outline' : 'ghost',
            size: mergedProps.size,
          }),
          mergedProps.class,
        )}
        {...rest}
      />
    </PaginationItem>
  )
}

const PaginationPrevious: typeof PaginationLink = (props) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <PaginationLink aria-label="Go to previous page" size="default" class={cn('gap-1 pl-2.5', props.class)} {...rest}>
      <ChevronLeft class="size-4" />
      <span>Previous</span>
    </PaginationLink>
  )
}

const PaginationNext: typeof PaginationLink = (props) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <PaginationLink aria-label="Go to next page" size="default" class={cn('gap-1 pr-2.5', props.class)} {...rest}>
      <span>Next</span>
      <ChevronRight class="size-4" />
    </PaginationLink>
  )
}

const PaginationEllipsis: Component<ComponentProps<'span'>> = (props) => {
  const [, rest] = splitProps(props, ['class'])
  return (
    <span aria-hidden class={cn('flex size-9 items-center justify-center', props.class)} {...rest}>
      <MoreHorizontal class="size-4" />
      <span class="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
