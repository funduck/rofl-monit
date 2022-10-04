import { ObservableState } from "../../core/values/observable_state";

/**
 * States of representation of containers
 */
export class ContainerState extends ObservableState {}

export const ContainerStateRunning = new ContainerState('running')
export const ContainerStateDied = new ContainerState('died')
export const ContainerStateStopped = new ContainerState('stopped')
