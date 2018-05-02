export interface FissionObject {
  kind: string;
  apiVersion: string;
  metadata: Metadata;
  spec: Spec;
  status?: string;
  testResults?: any;
}

export type Spec = FunctionSpec | PackageSpec | TriggerSpec;

export interface FunctionSpec {
  environment: Environment;
  package: Package;
  secrets?: any;
  configmaps?: any;
  resources: any;
  InvokeStrategy: InvokeStrategy;
}

export interface PackageSpec {
  environment: Environment;
  source: any;
  deployment: Deployment;
}

export interface TriggerSpec {
  host: string;
  relativeurl: string;
  method: string;
  functionref: Functionref;
}

export interface Functionref {
  type: string;
  name: string;
}

export interface Deployment {
  type: string;
  literal: string;
  checksum: any;
}

export interface InvokeStrategy {
  ExecutionStrategy: ExecutionStrategy;
  StrategyType: string;
}

export interface ExecutionStrategy {
  ExecutorType: string;
  MinScale: number;
  MaxScale: number;
  TargetCPUPercent: number;
}

export interface Package {
  packageref: Packageref;
}

export interface Packageref {
  namespace: string;
  name: string;
  resourceversion: string;
}

export interface Environment {
  namespace: string;
  name: string;
}

export interface Metadata {
  name: string;
  namespace: string;
  selfLink: string;
  uid: string;
  resourceVersion: string;
  creationTimestamp: string;
}
