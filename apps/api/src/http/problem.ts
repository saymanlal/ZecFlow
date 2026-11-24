import type { ErrorCode } from "@zecflow/protocol";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class ApiProblem extends Error {
  constructor(
    public status: ContentfulStatusCode,
    public code: ErrorCode,
    message: string,
    public retryable = false,
    public details?: Record<string, unknown>,
  ) {
    super(message);
  }
}
