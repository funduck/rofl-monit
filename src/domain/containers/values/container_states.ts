import { RepresentationState } from "../../core/values/representation_state";

export class ContainerState extends RepresentationState {}

export class ContainerRunningState extends ContainerState {}
export class ContainerDiedState extends ContainerState {}
export class ContainerStoppedState extends ContainerState {}
