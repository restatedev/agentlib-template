# A durable AI agent on Restate

One agent in one Restate service, running on [Modal](https://modal.com) and
connected to [Restate Cloud](https://cloud.restate.dev).

## Before you start

- `RESTATE_CONNECT_KEY`: The connect key of your Restate Cloud environment, from
  [**Configure SDK -> Create connect key**](https://cloud.restate.dev/to/developers/integration#configure-sdk).
- `OPENAI_API_KEY`: An OpenAI API key. Other providers and models are covered in the
  [agentlib README](https://github.com/restatedev/agentlib#capabilities).

## Run it locally

With Node 24 or later and pnpm:

```sh
pnpm install
node src/app.ts
```

Then, once, [register `connect://agentlib-template-v1`](https://cloud.restate.dev/to/overview?register-deployment=connect://agentlib-template-v1)
in the Cloud UI (the application prints this link too), or with the CLI:

```sh
npx @restatedev/restate@next deployments register connect://agentlib-template-v1
```

Ask a question from the [playground](https://cloud.restate.dev/to/overview?servicePlayground=Hello).

## Run it on Modal

[`modal/on_modal.py`](modal/on_modal.py) builds the image on Modal and runs the
app in one container, with your keys from a Modal secret:

```sh
pip install modal && modal setup
modal secret create agentlib-template RESTATE_CONNECT_KEY=${RESTATE_CONNECT_KEY} OPENAI_API_KEY=${OPENAI_API_KEY}
modal deploy modal/on_modal.py
```

Register `connect://agentlib-template` as above, and send requests the same
way. `modal app logs agentlib-template` follows it.

## Using AI coding tools

If you use Claude Code or Codex, the `restate-agents` plugin is installed
for Restate's generator SDK, plus the Restate docs MCP server. For Cursor and
automatically when you open this project: two skills, for the agent SDK and
other tools, see the [agentlib README](https://github.com/restatedev/agentlib#skills-for-coding-agents).

## Using client to send requests

Get the ingress key of your Restate Cloud environment from
[**Configure SDK -> Create ingress key**](https://cloud.restate.dev/to/developers/integration#configure-sdk).

Then send requests using `@restatedev/restate-sdk-clients`:

```ts
import * as clients from "@restatedev/restate-sdk-clients";

const rs = clients.connect();
const hello = rs.serviceClient({name: "Hello"});
console.log(await hello.ask("What can you do?"));
```

## What's next

This is the first lesson of the [agent tutorial](https://github.com/restatedev/agentlib/tree/main/packages/examples).
Continue there for tools, conversations, human approval, guardrails, and
multi-agent workflows, each in a numbered file you can bring into this project.
