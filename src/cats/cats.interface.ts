import { createZodDto } from "@anatine/zod-nestjs";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const NumericString = z
  .string()
  .or(z.number())
  .transform((val: string | number): number => {
    return typeof val === 'number' ? val : parseInt(val);
  })
  .refine((val) => {
    const isValid = val !== undefined && !isNaN(val);
    return isValid;
  }, 'Must be a valid number');

const Pagination = z.object({
  limit: z.string(),
  page: z.string(),
});

const TestObj = z.object({
  address: z.string().or(z.number()),
  friends: z.string().array(),
});

export class ZodTestDto extends createZodDto(TestObj) {}
export class ZodTestQueryDto extends createZodDto(Pagination) {}

export default function isRecord(obj: unknown): obj is Record<string, unknown> {
  return obj != null && typeof obj === 'object';
}

const AutotuneGroupContract = z
  .object({
    name: z.string().openapi({ description: 'Variant name' }),
    json: z
      .unknown()
      .refine(
        (args) => isRecord(args) && !Array.isArray(args),
        (args) => ({
          message: `Expected object, received ${
            Array.isArray(args) ? 'array' : args ? typeof args : 'null'
          }`,
        }),
      )
      .openapi({ description: 'Variant JSON data' }),
  });
  // .openapi({ description: 'An array of Variant objects' });

  export class AutotuneGroupContractDto extends createZodDto(AutotuneGroupContract) {}

  export const PaginationQueryContract = z.object({
    limit: NumericString.optional().openapi({
      description: 'Results per page',
      example: 10,
    }),
    page: NumericString.optional().openapi({
      description: 'Page number',
      example: 1,
    }),
  });
    
  const TeamFullUpdateContract = z.object({
    name: z.string().optional().nullable().openapi({
      description: 'The name of the team.',
    }),
    members: z.string().array().openapi({
      description: 'Array of member email addresses in the team.',
    }),
    admins: z.string().array().openapi({
      description: 'Array of admin email addresses in the team.',
    }),
    changeTeamConfigs: z.enum(['anyone', 'team_only']).openapi({
      description: 'Who can change team configurations: "anyone" or "team_only".',
    }),
    reviewApproval: z.enum(['anyone', 'team_only', 'admin_only']).openapi({
      description:
        'Who can review and approve changes: "anyone", "team_only", or "admin_only".',
    }),
    defaultTargetApplications: z.string().array().openapi({
      description: 'Default target applications for the team.',
    }),
    defaultHoldoutID: z.string().nullish().openapi({
      description: 'Default holdout ID for the team, if applicable.',
    }),
    requireReviews: z.boolean().nullish().openapi({
      description: 'Whether reviews are required for changes, if applicable.',
    }),
    requireGateTemplates: z.boolean().nullish().openapi({
      description:
        'Whether gate templates are required for the team, if applicable.',
    }),
    requireExperimentTemplates: z.boolean().nullish().openapi({
      description:
        'Whether experiment templates are required for the team, if applicable.',
    }),
  });

  export type TeamPartialUpdateType = z.infer<
  typeof TeamFullUpdateContract
>;
  export class TeamPartialUpdateDto extends createZodDto(
    TeamFullUpdateContract,
  ) {}



export const CatZ = 
  z.object({
    name: z.string(),
    age: z.number().gt(0),
    breed: z.string(),
    mouses: z.number().array().optional(),
    test1: z.string().array().optional(),
    test3: TestObj.array().optional(),
    testnull: z.string().nullable(),
    testRefine: AutotuneGroupContract.extend({
      id: z.string().openapi({
        description:
          'The name that was originally given to the autotune on creation but formatted as an ID ("A Autotune" -> "a_autotune").',
      }),
    }),
    pagination: PaginationQueryContract.partial(),
  })
;


export class ZodCatDto extends createZodDto(CatZ) {}