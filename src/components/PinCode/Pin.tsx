import * as React from "react";
import { InputOtp } from "@heroui/input-otp";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Icon } from "@iconify/react";

type PinCodeResult = { pin?: string; };
type PinCodeProps = {
  onSubmit: (result: PinCodeResult) => void;
  onClose: () => void;
  pinText: string;
};

const PIN_LENGTH = 4;
const BUTTON_SIZE_CLASS = "w-[80px] h-[80px] lg:w-[130px] lg:h-[30px] rounded-full lg:rounded-lg lg:mx-2 py-5";
const KEYBOARD_ICON_CLASS = "bg-[#27272a] px-2 rounded-md";
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const Pincode = ({ onSubmit, onClose, pinText }: PinCodeProps) => {
  const [pin, setPin] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const confirmButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pin.length === PIN_LENGTH) {
      onSubmit({ pin });
      onClose();
    }
  };

  const handleCancel = () => {

    onClose();
  };

  const updatePin = (newPin: string) => {
    if (newPin.length <= PIN_LENGTH) {
      setPin(newPin);
      if (newPin.length === PIN_LENGTH && confirmButtonRef.current) {
        confirmButtonRef.current.focus();
      }
    }
  };

  const handleNumberClick = (number: string) => updatePin(pin + number);
  const handleBackspace = () => updatePin(pin.slice(0, -1));

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") return handleCancel();
      if (e.key === "Enter" && pin.length === PIN_LENGTH) handleSubmit(e as any);
      
      if (/\d/.test(e.key) && pin.length < PIN_LENGTH) {
        updatePin(pin + e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [pin]);

  const renderControlButtons = (isMobile = false) => (
    <>
      <Button
        size={isMobile ? "md" : "lg"}
        onClick={pin ? handleBackspace : handleCancel}
        variant={isMobile? "flat" : "light"}
        color={pin ? "warning" : "danger"}
        className={BUTTON_SIZE_CLASS}
      >
        {isMobile ? (pin ? "Erase" : "Cancel") : (
          <>
            {pin ? "Erase" : "Cancel"}
            <div className={KEYBOARD_ICON_CLASS}>
              <Icon icon={pin ? "tabler:backspace-filled" : "mdi:keyboard-esc"} width="19" />
            </div>
          </>
        )}
      </Button>

      {!isMobile && (
        <Button
          size="lg"
          variant="light"
          color="primary"
          type="submit"
          className={BUTTON_SIZE_CLASS}
          ref={confirmButtonRef}
        >
          Confirm
          <div className={KEYBOARD_ICON_CLASS}>
            <Icon icon="fluent:arrow-enter-left-24-filled" width="19" />
          </div>
        </Button>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-lg flex justify-center items-center z-[9999]">
      <Form  className="w-screen items-center justify-center" onSubmit={handleSubmit}>
        <div className="fixed left-0 w-full flex justify-center items-center flex-col top-[15%] lg:top-[50%] lg:transform lg:-translate-y-1/2">
          <p className="text-center bottom-8 text-xl mb-2">Enter Passcode</p>
          
          
          <InputOtp
            ref={inputRef}
            // type="password"
            color="default"
            aria-label="PIN code input"
            length={PIN_LENGTH}
            size="sm"
            radius="full"
            variant="underlined"
            value={pin}
            
            isReadOnly
            className="text-center"
            placeholder="Enter passcode"
          />
<p className="text-center bottom-9 text-sm mb-2 opacity-50 flex max-w-[340px]">{pinText || ""}</p>
          <div className="hidden lg:block mt-4 ">
            {renderControlButtons()}
          </div>
          
        </div>

        <div className="items-center justify-center flex">
          
          <div className="grid grid-cols-3 gap-2 p-12 fixed bottom-4 w-screen lg:hidden max-w-[356px]">
            {NUMBERS.map(num => (
              <Button
                key={num}
                size="md"
                onClick={() => handleNumberClick(num.toString())}
                variant="flat"
                className={BUTTON_SIZE_CLASS}
              >
                {num}
              </Button>
            ))}
            
            {renderControlButtons(true)}
            
            <Button
              size="md"
              onClick={() => handleNumberClick("0")}
              variant="flat"
              className={BUTTON_SIZE_CLASS}
            >
              0
            </Button>

            {/* Mobile */}
            <Button
              size="md"
              variant="flat"
              color="primary"
              type="submit"
              className={BUTTON_SIZE_CLASS}
              disabled={pin.length !== PIN_LENGTH}
              
            >
              Confirm
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};