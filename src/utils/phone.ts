export const NIGERIA_COUNTRY_CODE = '+234';

export const normalizeNigerianPhoneNumber = (input: string) => {
  const digits = input.replace(/\D/g, '');

  if (!digits) {
    return NIGERIA_COUNTRY_CODE;
  }

  if (digits.startsWith('234')) {
    return `+${digits}`;
  }

  if (digits.startsWith('0')) {
    return `${NIGERIA_COUNTRY_CODE}${digits.slice(1)}`;
  }

  return `${NIGERIA_COUNTRY_CODE}${digits}`;
};
