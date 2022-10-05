# Rofl-monit

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

This is a monitoring tool for **docker containers**. Primary purpose is to detect **R**estart-**O**n-**F**ailure-**L**oops, a situation when containers exits with code not `0`, restarts, crashes again and so on.

Basic use is:

1. Choose Strategy to generate notifications
2. Choose Exporter for them
3. Run it!

## Contents

- [Rofl-monit](#rofl-monit)
  - [Contents](#contents)
  - [Motivation](#motivation)
- [Installation](#installation)
  - [Docker](#docker)
  - [From sources](#from-sources)
- [Usage](#usage)
  - [Configuration](#configuration)
- [Strategies](#strategies)
  - [Send all](#send-all)
  - [Detect loops](#detect-loops)
- [Exporters](#exporters)
  - [Console](#console)
  - [Telegram](#telegram)
- [Tests](#tests)

## Motivation

An inspiration for this app is [docker-telegram-notifier](https://github.com/arefaslani/docker-telegram-notifier) easy to use, but too straightforward. It spams all messages when container dies and restarts.

I wanted monitoring to be more clever.
Example of use case:

- If container is running for a long time, and only sometimes its healthchecks fail (1 of 50) I would consider it's state `running and healthy`.
- If healthchecks fail more frequently (1 of 10) I would consider it's state `running with hiccups`.

I would like to receive notifications when container's changes its **custom states**.

Concrete states are defined in [startegy](#strategies).

To export notifications app uses [exporters](#exporters): console, telegram.

# Installation

### Docker

`docker run <TODO image>`

### From sources

Get sources `git clone --depth 1 https://github.com/funduck/rofl-monit`.

Install `TODO`.

Run `TODO`

# Usage

- Choose notifications strategy.
- Set filter for containers.
- Set filter for notifications.
- Set exporter for notifications.

Example for docker:

```
docker run \
  -e APP_STRATEGY=send_all \
  -e APP_INCLUDE_CONTAINERS=* \
  -e APP_INCLUDE_NOTIFICATIONS=created,started,stopped,died,restarted \
  -e APP_EXPORTER=telegram \
  -e APP_TELEGRAM_BOT_TOKEN=<your bot token> \
  -e APP_TELEGRAM_CHATS=<chat id 1>,<chat id 2> \
  --name rofl-monit <TODO image>
```

## Configuration

Application uses environment variables for parameters.

`APP_STRATEGY` - string with strategy name, available: send_all, detect_loops.

`APP_INCLUDE_CONTAINERS` is list of strings/masks. Containers to be monitored.

`APP_INCLUDE_NOTIFICATIONS` is a list of strings/masks. Notifications to be exported.

`APP_EXPORTER` is string, available values: console, telegram.

`APP_TELEGRAM_BOT_TOKEN` is string, token of your telegram bot.

`APP_TELEGRAM_CHATS` is a list of strings, ids of chats in telegram.

# Strategies

Strategy uses incoming stream of docker events and may check container's state in docker directly.

Strategy decides when to emit notifications.

### Send all

`APP_STRATEGY=send_all`

It is straightforward strategy, just sends all docker events as notifications. Not good in production but good for debugging.

### Detect loops

`APP_STRATEGY=detect_loops`

It detects when something of following happens with container:

- created - when user creates new container
- destroyed - when user destroys container
- started - when user successfully starts container
- restarted - when user restarts container
- stopped - when user stops container
- paused - when user pauses container
- unpaused - when user unpauses container
- finished - when container exits with `0` code
- died - when container exits with `!= 0` code
- not healthy - when container health checks fail
- health recovered - when container health checks are ok again
- rofl started - when container starts restart-on-failure-loop
- rofl ended - when container exits restart-on-failure-loop and is running fine again

# Exporters

### Console

`APP_EXPORTER=console`

Just plain messages in console.

### Telegram

`APP_EXPORTER=telegram`

To use it you need:

- telegram bot token
- chat id in telegram

To create bot start chat with `https://t.me/botfather`.

To get id of a chat for notifications add your bot to that chat, write some message and perform request

```
https://api.telegram.org/bot<your bot token>/getUpdates
```

In response you will see unread messages, find `chat` object and take `id`.

Set parameters into environment before running **docker-monit**

```PowerShell
$Env:APP_EXPORTER='telegram'
$Env:APP_TELEGRAM_BOT_TOKEN='***'
$Env:APP_TELEGRAM_CHATS='***'
```

You can set up several chats for exporting.

In future I plan to enable changing list of chats on the fly.

# Tests

```
yarn install
yarn test -b --verbose --silent --watch
```
