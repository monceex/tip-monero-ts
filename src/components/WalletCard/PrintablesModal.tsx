import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Icon } from "@iconify/react";
import { QRCodeSVG } from "qrcode.react";

interface PrintablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeLink: string;
  secretPhrase: string;
  fileName: string;
  onSaveQR: () => void;
}

export const PrintablesModal = ({ isOpen, onClose, qrCodeLink, secretPhrase, fileName, onSaveQR }: PrintablesModalProps) => (
  <Modal isOpen={isOpen} onOpenChange={onClose}>
    <ModalContent>
      <ModalHeader>Printable Templates</ModalHeader>
      <ModalBody className="items-center">
        <div className="p-4 rounded-xl bg-white hidden"><QRCodeSVG value={qrCodeLink} width={200} height={200} /></div>
        <p className="text-sm px-2 py-1 mb-0 pb-0 rounded-lg text-start">
          Printable files aren’t auto-generated yet. Download the QR code and use my Figma template (with notes) to create and export your own.
          <br />
          <br />
          Want to contribute a template or idea? Send it to <br/><span className="bg-default">pungent-imply-oboe@duck.com</span> — I’ll add it to Figma and then here.
          <br /><br />
          Note:<br /> 
          The saved file will be named 
          <span className="bg-[#f26822] ml-1 text-black text-sm mt-0 px-2 rounded-lg max-w-[200px] font-bold">
            {fileName}</span><br /> 
          To restore the wallet, the user must know
            <br /> 
          the SECRET PHRASE 
          <span className="bg-[#f26822] ml-1 text-black text-sm mt-0 px-2 rounded-lg max-w-[200px] font-bold">
            {secretPhrase}
          </span>
        </p>
      </ModalBody>
      <ModalFooter>
        <Link isExternal href="https://www.figma.com/design/J7OBEG5Y1Q4YMGb8gJIwhh/Montip-Printable-Templates?m=auto&t=uW8kDO0Hn9qngRUB-1">
          <Button startContent={<Icon icon="solar:arrow-right-up-line-duotone" width="24" height="24" />} color="default" variant="bordered">
            Figma Template
          </Button>
        </Link>
        <Button startContent={<Icon icon="solar:download-square-bold-duotone" width="24" height="24" />} color="default" onClick={onSaveQR} variant="flat">
          Save QR
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);