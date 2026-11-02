/**
 * One agent, one request.
 *
 * `assistant` runs inside the `ask` handler. Restate journals every model call,
 * so if the process restarts mid-run the invocation resumes where it was instead
 * of starting over. Add tools, conversations, approvals and more by following
 * the tutorial: https://github.com/restatedev/agentlib/tree/main/packages/examples
 */
import {connect} from "@restatedev/restate-sdk";
import * as restate from "@restatedev/restate-sdk-gen";
import {agent} from "@restatedev/agentlib";
import {openAIModel} from "@restatedev/agentlib/openai";

// Reads OPENAI_API_KEY when a request comes in.
const assistant = agent({model: openAIModel({model: "gpt-5.6-luna"})});

export const hello = restate.service({
  name: "Hello",
  handlers: {
    *ask(question: string) {
      const result = yield* assistant.run(question);
      // A stopped or interrupted run may still carry a summary in output.
      return result.status === "completed" ? result.output : (result.output ?? result.reason);
    },
  },
});

connect({ services: [hello], name: "agentlib-template-v1" });
// To run locally, with a Restate server on this machine, use this instead:
// import {serve} from "@restatedev/restate-sdk";
// await serve({services: [hello], port: 9080});
