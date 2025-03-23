import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Icon } from "@iconify/react";
import { QRCodeSVG } from 'qrcode.react';
import { Link } from "@heroui/link";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeLink: string;
  secretPhrase: string;
  onCopyLink: () => void;
}

export const QRCodeModal = ({ isOpen, onClose, qrCodeLink, secretPhrase, onCopyLink }: QRCodeModalProps) => (
  <Modal isOpen={isOpen} onOpenChange={onClose}>
    <ModalContent>
      <ModalHeader>QR Code</ModalHeader>
      <ModalBody className="items-center">
        <Dropdown size="lg" offset={-150}>
          <DropdownTrigger>
            <div className="p-4 rounded-xl bg-white"><QRCodeSVG value={qrCodeLink} width={200} height={200} /></div>
          </DropdownTrigger>
          <DropdownMenu aria-label="actions">
            <DropdownItem key="copy-link" onPress={onCopyLink} startContent={<Icon icon="solar:copy-bold-duotone" width="24" height="24" />}><p className="text-[16px]">Copy</p></DropdownItem>
            <DropdownItem key="open-link" startContent={<Icon icon="solar:arrow-right-up-line-duotone" width="24" height="24" />}><Link isExternal color="foreground" className="text-[16px]" href={qrCodeLink}>Open</Link></DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <p className="text-sm">Tap on QR to open/copy</p>
        <p className="text-sm px-2 py-1 mb-0 pb-0 rounded-lg max-w-[200px] leading-none text-center">
          For wallet restoration via QR code, the user must know this secret phrase
        </p>
        <span className="bg-[#f26822] text-black px-2 text-sm py-1 mt-0 mb-4 rounded-lg max-w-[200px] font-bold leading-none text-center">{secretPhrase}</span>
      </ModalBody>
    </ModalContent>
  </Modal>
);