# A durable AI agent on Restate

One agent in one Restate service, running on [Modal](https://modal.com) and
connected to [Restate Cloud](https://cloud.restate.dev). Restate journals the
agent's model calls, so a crash or redeploy resumes the run instead of starting
it over. [src/app.ts](src/app.ts) is the whole application.

```ts
const assistant = agent({model: openAIModel({model: "gpt-5.6-luna"})});

export const hello = restate.service({
  name: "Hello",
  handlers: {
    *ask(question: string) {
      const result = yield* assistant.run(question);
      return result.status === "completed" ? result.output : (result.output ?? result.reason);
    },
  },
});
```

This is the first lesson of the [agent tutorial](https://github.com/restatedev/agentlib/tree/main/packages/examples).
Continue there for tools, conversations, human approval, guardrails, and
multi-agent workflows, each in a numbered file you can bring into this project.

## Before you start

- The connect key of your Restate Cloud environment, from
  [**Configure SDK -> Create connect key**](https://cloud.restate.dev/to/developers/integration#configure-sdk).
- An OpenAI API key. Other providers and models are covered in the
  [agentlib README](https://github.com/restatedev/agentlib#capabilities).

## Run it locally

With Node 24 or later and pnpm:

```sh
pnpm install
RESTATE_CONNECT_KEY=... OPENAI_API_KEY=... node src/app.ts
```

Then, once, [register `connect://agentlib-template`](https://cloud.restate.dev/to/overview?register-deployment=connect://agentlib-template)
in the Cloud UI (the application prints this link too), or with the CLI:

```sh
npx @restatedev/restate deployments register connect://agentlib-template
```

Ask a question from the [playground](https://cloud.restate.dev/to/overview?servicePlayground=Hello),
or with curl against your environment's ingress URL:

```sh
curl $RESTATE_INGRESS_URL/Hello/ask -H "authorization: Bearer $RESTATE_INGRESS_KEY" --json '"What can you do?"'
```

To run against a Restate server on your machine instead, swap `connect` for
the commented `serve` at the end of [src/app.ts](src/app.ts).

## Run it on Modal

[`modal/on_modal.py`](modal/on_modal.py) builds the image on Modal and runs the
app in one container, with your keys from a Modal secret:

```sh
pip install modal && modal setup
modal secret create agentlib-template RESTATE_CONNECT_KEY=... OPENAI_API_KEY=...
modal deploy modal/on_modal.py
```

Register `connect://agentlib-template` as above, and send requests the same
way. `modal app logs agentlib-template` follows it.

## Using AI coding tools

If you use Claude Code or Codex, the `restate-agents` plugin is installed
automatically when you open this project: two skills, for the agent SDK and
for Restate's generator SDK, plus the Restate docs MCP server. For Cursor and
other tools, see the [agentlib README](https://github.com/restatedev/agentlib#skills-for-coding-agents).

Plugin repo: https://github.com/restatedev/agentlib/tree/main/plugins/restate-agents
