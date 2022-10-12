# Rofl-monit

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![tests](https://github.com/funduck/jybid/actions/workflows/main.yml/badge.svg)](https://github.com/funduck/rofl-monit/blob/main/.github/workflows/node.js.yml)

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
- [Configuration](#configuration)
- [Strategies](#strategies)
  - [Send all](#send-all)
  - [Detect loops](#detect-loops)
- [Exporters](#exporters)
  - [Console](#console)
  - [Telegram](#telegram)
- [Tests](#tests)
- [Releases](#releases)
  - [v0.0.0](#v000)

## Motivation

An inspiration for this app is [docker-telegram-notifier](https://github.com/arefaslani/docker-telegram-notifier) easy to use, but too straightforward. It spams all messages when container dies and restarts.

I wanted monitoring to be more clever and to send me only one notification when container is in trouble.

# Installation

## Docker

```
docker run -d \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e APP_STRATEGY=detect_loops \
  -e APP_ROFL_DETECT_COUNT=3 \
  -e APP_ROFL_WINDOW_MSEC=600000 \
  -e APP_EXPORTER=telegram \
  -e APP_TELEGRAM_BOT_TOKEN=<TELEGRAM BOT TOKEN> \
  -e APP_TELEGRAM_CHAT=<TELEGRAM CHAT ID> \
  --name rofl-monit qlfunduck/rofl-monit:latest
```

## From sources

Get sources

```
git clone --depth 1 https://github.com/funduck/rofl-monit
```

Install

```
yarn install
```

Run

```
yarn run run
```

# Configuration

Application uses environment variables for parameters.

`APP_STRATEGY` - string with strategy name, available: send_all, detect_loops.

`APP_ROFL_DETECT_COUNT` - number, if _window_ contains at least this number of events "container died", ROFL is detected.

`APP_ROFL_WINDOW_MSEC` - number, milliseconds length of _window_ for ROFL detection.

`APP_INCLUDE_CONTAINERS` - javascript regexp for container name. Containers to be monitored.

`APP_INCLUDE_NOTIFICATIONS` - javascript regexp for notification text. Notifications to be exported.

`APP_EXPORTER` - string, available values: console, telegram.

`APP_TELEGRAM_BOT_TOKEN` - string, token of your telegram bot.

`APP_TELEGRAM_CHAT` - string, id of chat in telegram.

# Strategies

Strategy uses incoming stream of docker events and may check container's state in docker directly.

Strategy decides when to emit notifications.

## Send all

`APP_STRATEGY=send_all`

It is straightforward strategy, just sends all docker events as notifications. Not good in production but good for debugging.

## Detect loops

`APP_STRATEGY=detect_loops`

It detects when container "dies" (docker event "die" with `exit code != 0`) several times in short time window and emits ROFL notification (restart-on-failure-loop).

When container runs long enough, ROFL ends.

Size of window is configured by APP_ROFL_WINDOW_MSEC and number of "dies" by APP_ROFL_DETECT_COUNT.

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

Set parameters into environment before running **rofl-monit**

```PowerShell
$Env:APP_EXPORTER='telegram'
$Env:APP_TELEGRAM_BOT_TOKEN='***'
$Env:APP_TELEGRAM_CHAT='***'
```

# Tests

```
yarn install
yarn test -b --verbose --silent
```

# Releases

## v0.0.0

- strategies: send_all, detect_loops
- send_all tracks only container state changes
- detect_loops reacts on "died" event and checks when "ROFL" starts and ends
- notificators: console, telegram
- notifications on container: running, died, stopped, rofl, rofl ended
