import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema, private target: 'body' | 'query' | 'params' = 'body') {}

  transform(value: any, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'Validation failed',
        details: errors,
      });
    }
    return result.data;
  }
}
