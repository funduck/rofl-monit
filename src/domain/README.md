# domain

## Observable
Any object under monitoring.

## MonitoringEvent
Is a message from external world about some Object. It is consumed by Observer.

## Representation
Representation of observed Observable

## RepresentationState
Representation can change states, when it does, it emits events

## Observer
It accepts Events and can produce Notifications.

## ObserverStrategy
A strategy for Observer.

## Notification
Is a message to external world.

## Exporter
Sends Notifications to external world.
