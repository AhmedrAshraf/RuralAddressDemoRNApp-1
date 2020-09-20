import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class RuralAddress {
  readonly id: string;
  readonly latitude: string;
  readonly link: string;
  readonly longitude: string;
  readonly stateCity: string;
  readonly status: number;
  constructor(init: ModelInit<RuralAddress>);
  static copyOf(source: RuralAddress, mutator: (draft: MutableModel<RuralAddress>) => MutableModel<RuralAddress> | void): RuralAddress;
}