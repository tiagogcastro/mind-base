import { useState } from 'react';

export type UseDisclosureProps = {
  defaultIsOpen?: boolean;
}

export type UseDisclosureReturn = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export function useDisclosure(defaultProps?: UseDisclosureProps): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultProps?.defaultIsOpen ?? false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen((prev) => !prev);

  return {
    setIsOpen,
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
}