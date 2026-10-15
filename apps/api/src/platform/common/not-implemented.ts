import { NotImplementedException } from '@nestjs/common';

/** Placeholder used by skeleton endpoints. Grep for `notImplemented(` to find unbuilt work. */
export function notImplemented(operation: string, requirements: string): Promise<never> {
  return Promise.reject(
    new NotImplementedException({ operation, requirements, message: `${operation} is not built yet` }),
  );
}
