/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

/**
 * This file was copied from:
 *   https://github.com/anatine/zod-plugins/blob/main/packages/zod-nestjs/src/lib/patch-nest-swagger.ts
 */
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi'

import { INestApplication } from '@nestjs/common'
import type { SchemaObject } from 'openapi3-ts/oas31'
import { SwaggerDocumentOptions } from '@nestjs/swagger'

interface Type<T = any> extends Function {
  new (...args: any[]): T
}

interface Options {
  /** @default default */
  schemasSort?: 'default' | 'alpha' | 'localeCompare'
}

interface Modules {
  schemaObjectFactoryModule?: typeof import('@nestjs/swagger/dist/services/schema-object-factory')
  swaggerScannerModule?: typeof import('@nestjs/swagger/dist/swagger-scanner')
}

export function patchNestjsSwagger(
  options: Options = {},
  modules: Modules = {},
) {
  const { schemasSort = 'default'} = options
  const {
    schemaObjectFactoryModule = require('@nestjs/swagger/dist/services/schema-object-factory'),
    swaggerScannerModule = require('@nestjs/swagger/dist/swagger-scanner'),
  } = modules

  const registry = new OpenAPIRegistry()

  /**
   * Override `exploreModelSchema` from schema-object-factory
   */
  const { SchemaObjectFactory } = schemaObjectFactoryModule
  const orgExploreModelSchema = SchemaObjectFactory.prototype.exploreModelSchema
  SchemaObjectFactory.prototype.exploreModelSchema = function (
    type: Type<unknown> | Function | any,
    schemas: Record<string, SchemaObject>,
    schemaRefsStack: string[] = [],
  ) {
    if (this.isLazyTypeFunc(type)) {
      // eslint-disable-next-line no-param-reassign
      type = (type as Function)()
    }

    if (!type.zodSchema) {
      return orgExploreModelSchema.call(this, type, schemas, schemaRefsStack)
    }

    registry.register(type.name, type.zodSchema)

    return type.name
  }

  /**
   * Override `scanApplication` from swagger-scanner
   */
  const { SwaggerScanner } = swaggerScannerModule
  const orgScanApplication = SwaggerScanner.prototype.scanApplication
  SwaggerScanner.prototype.scanApplication = function (
    app: INestApplication,
    options: SwaggerDocumentOptions,
  ) {
    const openAPIObject = orgScanApplication.call(this, app, options)

    const generator = new OpenApiGeneratorV3(registry.definitions)
    const doc = generator.generateComponents()

    const schemas = {
      ...openAPIObject.components.schemas,
      ...doc.components?.schemas,
    }

    if (schemasSort === 'alpha') {
      const sortedSchemas = Object.entries(schemas).sort(([aKey], [bKey]) => {
        if (aKey < bKey) return -1
        if (aKey > bKey) return 1
        return 0
      })

      openAPIObject.components.schemas = Object.fromEntries(sortedSchemas)
    } else if (schemasSort === 'localeCompare') {
      const sortedSchemas = Object.entries(schemas).sort(([aKey], [bKey]) =>
        aKey.localeCompare(bKey),
      )

      openAPIObject.components.schemas = Object.fromEntries(sortedSchemas)
    } else {
      openAPIObject.components.schemas = schemas
    }

    return openAPIObject
  }
}
