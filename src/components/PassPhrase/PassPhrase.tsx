import { findClosestWord, WordList } from "@/utils/words";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tooltip } from "@heroui/tooltip";
import React, { useState, useEffect, useRef } from "react";


interface PassPhraseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (pass: string) => void; // Добавлен пропс onSubmit
  passText?: string;
}

export const PassPhraseModal: React.FC<PassPhraseModalProps> = ({
  visible,
  onClose,
  onSubmit,
  passText,
}) => {
  const [firstWord, setFirstWord] = useState("");
  const [secondWord, setSecondWord] = useState("");
  const [suggestOne, setSuggestOne] = useState("");
  const [suggestTwo, setSuggestTwo] = useState("");
  const [isFirstInputActive, setIsFirstInputActive] = useState(false);
  const [isSecondInputActive, setIsSecondInputActive] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);

  // Обработка подсказок для первого слова
  useEffect(() => {
    const trimmedWord = firstWord.toLowerCase().trim();
    setSuggestOne(findClosestWord(trimmedWord, WordList));
  }, [firstWord]);

  // Обработка подсказок для второго слова
  useEffect(() => {
    const trimmedWord = secondWord.toLowerCase().trim();
    setSuggestTwo(findClosestWord(trimmedWord, WordList));
  }, [secondWord]);

  // Автоматический переход на второе поле, если есть 100% совпадение или нажата подсказка
  useEffect(() => {
    if (firstWord.toLowerCase().trim() === suggestOne && firstWord !== "") {
      secondInputRef.current?.focus();
    }
  }, [firstWord, suggestOne]);

  // Обработка клика по подсказке для первого слова
  const handleTooltipClickFirst = () => {
    setFirstWord(suggestOne);
    setIsFirstInputActive(false);
    secondInputRef.current?.focus(); // Переход на второе поле
  };

  // Обработка клика по подсказке для второго слова
  const handleTooltipClickSecond = () => {
    setSecondWord(suggestTwo);
    setIsSecondInputActive(false);
  };

  // Обработка отправки формы
  const handleSubmit = () => {
    const passphrase = `${firstWord} ${secondWord}`;
    onSubmit(passphrase); // Вызов onSubmit из пропсов
  };

  // Если модальное окно не видно, не рендерим его
  if (!visible) return null;

  return (
    <div className="fixed inset-0 max-h-screen bg-black bg-opacity-30 backdrop-blur-lg flex justify-center items-center z-[9999]">
      <div className="fixed left-0 w-full flex justify-center items-center flex-col top-[50%] transform -translate-y-1/2">
        <p className="text-center bottom-8 text-xl mb-2 py-2">Enter Secret Key</p>
        <div className="flex flex-row md:flex-nowrap gap-4 px-4 max-w-[340px]">
          {/* Поле для первого слова с подсказкой */}
          <Tooltip
            placement="bottom"
            size="lg"
            offset={14}
            isDismissable={false}
            crossOffset={2}
            className="p-0"
            isOpen={
              isFirstInputActive && firstWord.length > 0 && firstWord !== suggestOne
            }
            content={
              <Button variant="light" onPress={handleTooltipClickFirst} fullWidth>
                {suggestOne}
              </Button>
            }
          >
            <Input
              label=""
              type="text"
              value={firstWord}
              onChange={(e) => setFirstWord(e.target.value.toLowerCase().trim())}
              onFocus={() => setIsFirstInputActive(true)}
              onBlur={() => setIsFirstInputActive(false)}
              placeholder="First word"
              ref={firstInputRef}
            />
          </Tooltip>

          {/* Поле для второго слова с подсказкой */}
          <Tooltip
            placement="bottom"
            size="lg"
            isDismissable={false}
            crossOffset={2}
            offset={14}
            isOpen={
              isSecondInputActive && secondWord.length > 0 && secondWord !== suggestTwo
            }
            content={
              <Button variant="light" onPress={handleTooltipClickSecond} fullWidth>
                {suggestTwo}
              </Button>
            }
          >
            <Input
              label=""
              type="text"
              value={secondWord}
              onChange={(e) => setSecondWord(e.target.value.toLowerCase().trim())}
              onFocus={() => setIsSecondInputActive(true)}
              onBlur={() => setIsSecondInputActive(false)}
              placeholder="Second word"
              ref={secondInputRef}
            />
          </Tooltip>
        </div>

        {/* Текст с инструкцией */}
        <div className="max-w-[340px] px-4">
          <p className="text-center bottom-9 text-sm mb-2 opacity-50 flex max-w-[340px] py-2">
            {passText || ""}
          </p>

          {/* Кнопка для отправки */}
          <Button
            onPress={handleSubmit}
            variant="flat"
            color="default"
            fullWidth
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};