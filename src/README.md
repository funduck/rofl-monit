# Sources

Source code is split into DDD layers:

- application
- domain
- infra
- interface

## Application

Facade of domain.
There are several services:

- monitoring - produces input to domain
- observer - accepts monitoring events and keeps state of models
- signaling - produces notification events
- notificator - sends notifications

## Domain

All business logic.
Describes models and services that keep states of models.

## Infra

Everything that supports applications.

## Interface

Connection between applications and external world.

- Monitoring interface and its implementation for docker.
- Notificator interface and its implementations.
