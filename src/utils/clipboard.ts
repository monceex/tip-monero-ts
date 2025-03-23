export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, text.length);

    const success = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!success) {
      throw new Error('Failed to copy text using execCommand');
    }

    return success;
  } catch (error) {
    console.error('Error while copying text:', error);
    return false;
  }
};