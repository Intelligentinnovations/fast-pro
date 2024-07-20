import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  EnumLike,
  ZodArray,
  ZodBoolean,
  ZodFirstPartyTypeKind,
  ZodNativeEnum,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodRawShape,
  ZodString,
} from 'zod';

export function zodToApi(schema: ZodObject<ZodRawShape>): SchemaObject {
  const typeMap: Partial<Record<ZodFirstPartyTypeKind, string>> = {
    [ZodFirstPartyTypeKind.ZodBoolean]: 'boolean',
    [ZodFirstPartyTypeKind.ZodString]: 'string',
    [ZodFirstPartyTypeKind.ZodNumber]: 'number',
    [ZodFirstPartyTypeKind.ZodObject]: 'object',
    [ZodFirstPartyTypeKind.ZodNativeEnum]: 'string',
  };

  const properties: Record<string, SchemaObject> = {};
  const required: string[] = [];

  const shape = schema._def.shape();

  for (const i in shape) {
    const property = zodFieldTpApi(shape[i]!);
    if (!property.schema) continue;

    const field: SchemaObject = {
      type: typeMap[property.schema._def.typeName],
      nullable: property.nullable,
      example: property.description,
    };

    switch (property.schema._def.typeName) {
      case ZodFirstPartyTypeKind.ZodObject:
        Object.assign(
          field,
          zodToApi(property.schema as ZodObject<ZodRawShape>)
        );
        break;
      case ZodFirstPartyTypeKind.ZodNativeEnum:
        console.log(property.schema);
        field.enum = Object.values(property.schema._def.values);
        break;
    }

    properties[i] = field;

    if (property.required) required.push(i);
  }

  return {
    type: 'object',
    properties,
    required,
    description: schema._def.description,
  };
}

type Property = {
  required?: boolean;
  nullable?: boolean;
  description?: string;
  schema?:
    | ZodString
    | ZodNumber
    | ZodBoolean
    | ZodObject<ZodRawShape>
    | ZodNativeEnum<EnumLike>;
};

export function zodFieldTpApi<
  T extends ZodString | ZodNumber | ZodBoolean | ZodObject<ZodRawShape>
>(
  schema: T | ZodOptional<T> | ZodNullable<T> | ZodArray<T>,
  prev: Property = { required: true, nullable: false }
): Property {
  if (schema._def.description) prev.description = schema._def.description;

  if (schema._def.typeName === 'ZodNullable') {
    return zodFieldTpApi(schema._def.innerType, { ...prev, nullable: true });
  } else if (schema._def.typeName === 'ZodOptional') {
    return zodFieldTpApi(schema._def.innerType, { ...prev, required: false });
  } else {
    return { ...prev, schema: schema as T };
  }
}
