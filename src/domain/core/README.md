# domain

## Object
Any object under monitoring.

## Event
Is a message from external world about some Object. It is consumed by Strategies.

## Strategy
It accepts Events and can produce Notifications to Exporter at any moment.

## Notification
Is a message to external world.

## Exporter
Sends Notifications to external world.
