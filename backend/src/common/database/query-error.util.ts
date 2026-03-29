import { QueryFailedError } from 'typeorm';

type DriverError = {
  code?: string;
  constraint?: string;
};

const POSTGRES_UNIQUE_VIOLATION_CODE = '23505';

export function isUniqueConstraintViolation(
  error: unknown,
  constraintName?: string,
): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  const driverError = error.driverError as DriverError;

  if (driverError.code !== POSTGRES_UNIQUE_VIOLATION_CODE) {
    return false;
  }

  if (!constraintName) {
    return true;
  }

  return driverError.constraint === constraintName;
}
