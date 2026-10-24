import type { PluginLocalization } from "./config";
import type { ConfigSchema, ParamsSchema } from "./schema";
import type { PluginErrorCode } from "./errors";
export type { PluginErrorCode } from "./errors";
import type { Config, Json } from "./config";
export type { Config, Json } from "./config";
export type Kind = "path" | "storage" | "processor";
export type Locator = string | Config | null;
export interface Metadata {
  mimeType: string | null;
  byteSize: number | null;
  width: number | null;
  height: number | null;
  animated?: boolean;
  alpha?: boolean;
}
export interface FileInput {
  readonly metadata: Readonly<Metadata>;
  openRead(): Promise<ReadableStream<Uint8Array>>;
}
export interface Output extends FileInput {
  readonly handle: string;
  /** Write once through the host's temporary-space budget. */
  write(stream: ReadableStream<Uint8Array>): Promise<void>;
}
export interface Context {
  signal: AbortSignal;
  requestId: string;
  log(event: string): void;
}
export interface PipelineDataReader {
  get(namespace: string): Json | undefined;
}
export interface PipelineData extends PipelineDataReader {
  set(namespace: string, value: Json): void;
}
export interface CheckContext extends Context {
  data: PipelineDataReader;
}
export interface PipelineContext extends Context {
  data: PipelineData;
}
export type Stage = "upload" | "access" | "post_save";
export type Parameters = Record<string, string | number | boolean>;
export type Query = Record<string, string[]>;
export interface FileOrigin {
  readonly kind: "upload" | "import";
  readonly userId: string | null;
}
export interface OrganizationItem {
  readonly id: string;
  readonly name: string;
}
export interface FileOrganization {
  readonly tags: readonly OrganizationItem[];
  readonly collections: readonly OrganizationItem[];
}
export interface OrganizationUpdate {
  readonly tagIds?: readonly string[];
  readonly collectionIds?: readonly string[];
}
export interface FileContext {
  readonly id: string;
  readonly createdAt: number;
  readonly origin: Readonly<FileOrigin>;
  readonly ownerId: string | null;
  readonly organization: Readonly<FileOrganization>;
}
export interface OrganizationQuery {
  q?: string;
  limit?: number;
  offset?: number;
}
export interface OrganizationPage {
  items: OrganizationItem[];
  total: number;
}
/** Registered owners only. Skip these services when record.ownerId is null. */
export interface OrganizationReader {
  listTags(query?: OrganizationQuery): Promise<OrganizationPage>;
  listCollections(query?: OrganizationQuery): Promise<OrganizationPage>;
}
export interface OrganizationWriter extends OrganizationReader {
  ensureTag(input: { name: string }): Promise<OrganizationItem>;
  ensureCollection(input: { name: string }): Promise<OrganizationItem>;
}
export interface UploadCheckContext extends CheckContext {
  readonly organization: OrganizationReader;
}
export interface UploadProcessContext extends PipelineContext {
  readonly organization: OrganizationWriter;
}
export interface PostSaveContext extends PipelineContext {
  readonly organization: OrganizationWriter;
}
export interface UploadCheckInput {
  readonly params: Parameters;
  readonly file: FileInput;
  readonly limits: { maxDimension: number; maxPixels: number };
  readonly record: FileContext;
}
export interface UploadProcessInput extends UploadCheckInput {
  createOutput(): Promise<Output>;
}
export interface Runtime {
  dispose?(): void | Promise<void>;
}
export interface PathPlugin extends Runtime {
  generate(
    input: {
      readonly record: FileContext;
      readonly metadata: Readonly<Metadata>;
      readonly originalName?: string;
    },
    context: Context,
  ): Promise<{ logicalKey: string; storageKey?: string }>;
}
export type ReadResult =
  | {
      type: "stream";
      stream: ReadableStream<Uint8Array>;
      mimeType?: string;
      byteSize?: number;
    }
  | {
      type: "redirect";
      url: string;
      /** URL expiration as a Unix timestamp in milliseconds. */
      expiresAt?: number;
    };
export interface StoragePlugin extends Runtime {
  write(
    input: {
      operationId: string;
      fileId: string;
      storageKey: string;
      file: FileInput;
    },
    context: Context,
  ): Promise<{ locator?: Locator }>;
  read(
    input: { storageKey: string; locator: Locator; mode: "auto" | "stream" },
    context: Context,
  ): Promise<ReadResult>;
  delete(
    input: { operationId: string; storageKey: string; locator: Locator },
    context: Context,
  ): Promise<void>;
  listFiles?(
    input: { scope?: string; cursor?: string; limit: number },
    context: Context,
  ): Promise<{
    items: Array<{
      storageKey: string;
      locator?: Locator;
      byteSize?: number;
      mimeType?: string;
    }>;
    nextCursor: string | null;
  }>;
}
export type CheckResult =
  | { status: "applicable" }
  | { status: "noop" }
  | { status: "unsupported"; reason?: string };
export type UploadResult =
  | { status: "pass"; organization?: OrganizationUpdate }
  | { status: "replace"; output: Output; organization?: OrganizationUpdate }
  | { status: "reject"; reason: string };
export interface UploadPlugin extends Runtime {
  check(
    input: UploadCheckInput,
    context: UploadCheckContext,
  ): Promise<CheckResult>;
  process(
    input: UploadProcessInput,
    context: UploadProcessContext,
  ): Promise<UploadResult>;
}
export type ImageProcessResult =
  | { status: "pass" }
  | { status: "replace"; output: Output }
  | { status: "reject"; reason: string };
export interface AccessCheckInput {
  readonly params: Parameters;
  readonly limits: { maxDimension: number; maxPixels: number };
  readonly metadata: Readonly<Metadata>;
  getFile(): Promise<FileInput>;
}
export interface AccessProcessorInput extends AccessCheckInput {
  createOutput(): Promise<Output>;
}
export interface AccessPlugin extends Runtime {
  check(input: AccessCheckInput, context: CheckContext): Promise<CheckResult>;
  process(
    input: AccessProcessorInput,
    context: PipelineContext,
  ): Promise<ImageProcessResult>;
  cacheable?: boolean;
}
export type PostSaveDisposition = "pass" | "block" | "delete";
export interface DispositionUpdate {
  readonly value: PostSaveDisposition;
  readonly mode?: "escalate" | "replace";
}
export interface PostSaveResult {
  readonly disposition?: DispositionUpdate;
  readonly organization?: OrganizationUpdate;
  /** Compact file-related JSON summary; never include secrets or file bytes. */
  readonly details?: Config;
}
export interface PostSaveStepResult extends PostSaveResult {
  readonly stepId: string;
  readonly pluginId: string;
  readonly pluginVersion: string;
  readonly completedAt: number;
}
export interface PostSavePlugin extends Runtime {
  execute(
    input: {
      readonly operationId: string;
      readonly record: FileContext;
      readonly publicPath: string;
      /** Accumulated disposition before this step; does not end the pipeline. */
      readonly currentDisposition: PostSaveDisposition;
      /** Isolated snapshot of successfully completed steps in this attempt. */
      readonly previousResults: readonly Readonly<PostSaveStepResult>[];
      /** Relative when no site/image origin is configured. */
      readonly url: string;
      readonly file: FileInput;
    },
    context: PostSaveContext,
  ): Promise<PostSaveResult>;
}
export interface Runtimes {
  path: PathPlugin;
  storage: StoragePlugin;
  upload: UploadPlugin;
  access: AccessPlugin;
  post_save: PostSavePlugin;
}
export interface InstanceServices {
  readonly images: { readonly sharp: typeof import("sharp") };
  log(event: string): void;
  readSecrets(): Promise<{ value: Config; version: number }>;
  updateSecrets(value: Config, expectedVersion: number): Promise<void>;
  readState(): Promise<{ value: Config; version: number }>;
  updateState(value: Config, expectedVersion: number): Promise<void>;
}
export interface Descriptor<R extends Runtime> {
  configSchemaVersion: number;
  /** Omit for no custom configuration. Defaults initialize drafts, never saves or reads. */
  configSchema?: ConfigSchema;
  /** Preview-time data conversion; supply new values explicitly, including required values. */
  migrateConfig?(input: {
    from: { pluginVersion: string; configSchemaVersion: number };
    apiVersion: 1;
    config: Config;
  }): Promise<Config>;
  /** Save-time semantic check of the full configuration, including sensitive values. */
  validateConfig?(
    config: Readonly<Config>,
  ): Promise<Array<{ message: string; path?: string }>>;
  createInstance(input: {
    id: string;
    /** Validated ordinary configuration; read sensitive values through services.readSecrets(). */
    config: Readonly<Config>;
    services: InstanceServices;
  }): Promise<R>;
}
export type StageDefinitions = {
  upload?: Descriptor<UploadPlugin> & { paramsSchema?: ParamsSchema };
  access?: Descriptor<AccessPlugin> & { paramsSchema?: ParamsSchema };
  post_save?: Descriptor<PostSavePlugin>;
};
interface Identity<K extends Kind> extends PluginLocalization {
  nameKey: string;
  id: string;

  kind: K;
  version: string;
  apiVersion: 1;
}
export type Definition<K extends Kind = Kind> = K extends "processor"
  ? Identity<K> & { stages: StageDefinitions }
  : K extends "path" | "storage"
    ? Identity<K> &
        Descriptor<Runtimes[K]> &
        (K extends "storage" ? { localDirectory?: { configPath: string } } : {})
    : never;
export class PluginError extends Error {
  constructor(
    public code: PluginErrorCode,
    message: string,
    // Allows task retries; never inferred from code.
    public retryable = false,
  ) {
    super(message);
    this.name = "PluginError";
  }
}

/** Structural error protocol: works when each package bundles its own SDK. */
export function isPluginError(error: unknown): error is Error & {
  code: string;
  retryable: boolean;
} {
  if (!error || typeof error !== "object") return false;
  const e = error as Partial<PluginError>;
  return (
    e.name === "PluginError" &&
    typeof e.message === "string" &&
    typeof e.code === "string" &&
    typeof e.retryable === "boolean"
  );
}
