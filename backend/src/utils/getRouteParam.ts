import AppError from './AppError.ts';

export function getRouteParam(value: string | string[] | undefined, paramName = 'id'): string {
  if (typeof value !== 'string') {
    throw new AppError(`Некорректный параметр: ${paramName}`, 400);
  }
  return value;
}
