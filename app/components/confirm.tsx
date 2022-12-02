import React, {PropsWithChildren} from "react";
import {
  Button, Heading,
  Popover,
  PopoverArrow, PopoverBody, PopoverCloseButton,
  PopoverContent, PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useDisclosure
} from "@chakra-ui/react";

export interface ConfirmPopoverProps extends PropsWithChildren {
  onConfirm?: () => any
  title?: string
  message?: string
  confirmButtonText?: string
  confirmButtonColorScheme?: string
}

export const ConfirmPopover: React.FC<ConfirmPopoverProps> = (
  {children, onConfirm, confirmButtonText, confirmButtonColorScheme, title, message }
) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      closeOnBlur={false}
    >
      <PopoverTrigger>
        {children}
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <Heading size="sm">
              {title}
            </Heading>
          </PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            {message}
          </PopoverBody>
          <PopoverFooter textAlign="right">
            <Button size="sm" onClick={onClose} mr="10px">Cancel</Button>
            <Button size="sm" colorScheme={confirmButtonColorScheme} onClick={() => {
              onConfirm?.()
              onClose()
            }}>{confirmButtonText}</Button>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}