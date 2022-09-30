import { RepresentationState } from "../../core/values/representation_state";

/**
 * States of representation of containers
 */
export class ContainerState extends RepresentationState {}

export const ContainerRunningState = new ContainerState('running')
export const ContainerDiedState = new ContainerState('died')
export const ContainerStoppedState = new ContainerState('stopped')
