import { IsDateString, Matches } from 'class-validator';

const ISO_DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function IsIsoDateOnly(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    IsDateString({ strict: true })(target, propertyKey as string);
    Matches(ISO_DATE_ONLY_REGEX, {
      message: '$property must be in YYYY-MM-DD format',
    })(target, propertyKey as string);
  };
}
