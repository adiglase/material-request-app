export function trimRequiredString(value: unknown) {
  return typeof value === 'string' ? value.trim() : value;
}

export function trimOptionalString(value: unknown) {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue === '' ? undefined : trimmedValue;
}
