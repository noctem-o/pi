<a id="endophasia"></a>

<div align="center">

<p><sub>WORK &nbsp; / &nbsp; DREAM &nbsp; / &nbsp; OBSERVE &nbsp; / &nbsp; VERIFY</sub></p>

<h1>endophasia</h1>

<p><strong>Instrumented cognition for coding agents.</strong></p>

<p>
A Pi-based research workbench for making agent computation<br>
<strong>visible, steerable, comparable, and governable.</strong>
</p>

<p>
  <a href="#current-boundary"><img src="https://img.shields.io/badge/status-experimental-637d69?style=flat-square" alt="Status: experimental"></a>
  <a href="https://github.com/earendil-works/pi"><img src="https://img.shields.io/badge/upstream-Pi-536c85?style=flat-square" alt="Upstream: Pi"></a>
  <a href="#runtime-v0"><img src="https://img.shields.io/badge/runtime-multiprocess%20v0-2f6f4e?style=flat-square" alt="Runtime: multiprocess v0"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-94765e?style=flat-square" alt="License: MIT"></a>
</p>

<p>
  <a href="#why-endophasia">Why</a> &nbsp; · &nbsp;
  <a href="#implemented-surfaces">Implemented</a> &nbsp; · &nbsp;
  <a href="#runtime-v0">Runtime</a> &nbsp; · &nbsp;
  <a href="#architecture">Architecture</a> &nbsp; · &nbsp;
  <a href="#roadmap">Roadmap</a>
</p>

</div>

---

Most coding-agent interfaces show the prompt, the tools, and the answer.

The interesting system is increasingly everything around the model:

~~~text
context selection
runtime state
branching
reasoning budget
tool configuration
verification
usage and cost
human steering
action proposals
authority
~~~

**Endophasia turns that hidden harness into an instrument panel.**

Not a chain-of-thought viewer. Not an agent swarm dashboard. A systems surface for seeing and steering what actually happened.

> [!IMPORTANT]
> **Endophasia is experimental, but it is no longer only architectural scaffolding.** The fork now contains versioned runtime projections, bounded steering/control primitives, a read-only Chord Inspector, and a source-only Endophasia runtime that launches real Pi Session workers and exposes the Inspector through Pi's multiprocess client/service path. Pallium integration, Magpie evidence surfaces, Deadbolt authority, Work / Dream policy, richer presentation clients, generic runtime adapters, and local white-box instrumentation remain future work.

## Why Endophasia

A capable agent should be allowed to reason flexibly without making its surrounding system vague.

Endophasia is being shaped around five rules:

~~~text
preserve continuity
instrument reality
escalate cognition selectively
keep plans inspectable
keep authority outside the model
~~~

A short version:

~~~text
Endophasia exposes.
Pallium reasons.
Instruments measure.
Magpie remembers.
Deadbolt permits.
~~~

No line implies another.

The project tries to keep several distinctions explicit:

- observation is not interpretation;
- accepted input is not executed work;
- configured state is not necessarily in-flight state;
- operational history is not epistemic standing;
- a valid plan is not permission to execute it;
- more reasoning does not grant more authority.

## Why Pi

Pi is a useful substrate because it exposes concrete runtime distinctions that Endophasia can project instead of simulating.

The parts Endophasia currently leans on most are:

~~~text
AgentHarness / Session / AgentLane
  ├─ durable lane history and ancestry
  ├─ atomic per-lane watch snapshots
  ├─ steer + follow-up queues
  ├─ durable operation outcomes
  ├─ session usage accounting
  ├─ model / thinking / active-tool configuration
  └─ lifecycle events

remote runtime
  ├─ Pi client
  ├─ transport-neutral protocol
  ├─ server + Session-worker split
  ├─ presentation attachments
  └─ Session service routing

Chord
  ├─ typed services
  ├─ trusted host facets
  ├─ reloadable plugin facets
  ├─ replicated state
  └─ transport-independent remote service calls
~~~

These are **upstream Pi capabilities**, not Endophasia inventions.

Endophasia adds narrow semantics on top: projections that say exactly what they observed, receipts that do not claim more than the underlying runtime established, and host-owned composition where authority must stay outside reloadable plugins.

## Implemented surfaces

The current Endophasia core is intentionally small and versioned.

| Surface | Status | What it establishes |
| :--- | :--- | :--- |
| **Mission Trace v0** | Implemented | Passive projection of selected <code>AgentHarness.events</code> lifecycle events into a bounded mission / turn / tool timeline. |
| **Continuity v0** | Implemented | One lane's durable active ancestry plus Pi's compaction-bounded context-source window. It is **not** the final provider-visible prompt. |
| **Steering Controls v0** | Implemented | STEER, QUEUE, and STOP mapped to Pi's durable queues / abort request with acceptance-or-request receipts. |
| **Session Overview v0** | Implemented | Payload-minimal lane inventory with tips and open operations. Consistency is explicitly **per lane**, not a session-wide atomic snapshot. |
| **Durable Outcomes v0** | Implemented | Read-only projection of Pi's immutable terminal operation result for an operation ID. |
| **Runtime Metrics v0** | Implemented | Session-wide cumulative message, token, cache, reasoning, and accounted-cost totals from Pi's maintained stats. |
| **Usage Ledger v0** | Implemented | Forward paging over durable usage rows with explicit cursor semantics. |
| **Usage Feed v0** | Implemented | Durable catch-up followed by a gap-safe live handoff; reconnects are at-least-once when the caller persists the cursor. |
| **Runtime Control Deck v0** | Implemented | Read/configure lane model, thinking level, and active tools with read-after-write receipts. Configuration changes are not transactional with in-flight requests. |
| **Endophasia Inspector v0** | Implemented | Read-only Chord service <code>endophasia.inspector.v0</code>; each call captures a fresh Session Overview. |
| **Endophasia Runtime v0** | Implemented, source-only | Endophasia-owned server / Session-worker composition using the normal coding-agent bootstrap and a trusted Inspector host facet over the real Pi multiprocess path. |

The implementation deliberately does **not** imply a browser cockpit, epistemic memory, action authority, or a generic runtime-adapter framework. Those are separate layers.

## Mission Trace

Mission Trace v0 is the first implemented execution projection: a real, observable timeline derived from selected harness lifecycle events.

The broader idea remains larger than v0:

~~~text
08:14  mission started
08:15  primary inspected runtime/
08:18  hypothesis H1 created
08:21  test contradicted H1
08:24  independent challenge requested
08:29  candidate patch
08:31  tests passed
08:33  benchmark regressed
08:36  candidate rejected
08:43  second candidate verified
~~~

Today, v0 stays deliberately closer to what Pi can establish directly: mission/run lifecycle, turns, assistant completion, tool start/end, suspension/resumption, and terminal run status.

The rule is simple:

> If the interface says something happened, a real event should exist underneath it.

Missing should remain missing.

Peers may eventually be useful for independent verification, adversarial challenge, orthogonal search, or genuine isolation. They are not the default way to divide ordinary sequential thought.

## Continuity and context

Continuity v0 captures one lane at one durable tip:

~~~text
durable active ancestry
        │
        ├─ messages
        ├─ compactions
        ├─ branch summaries
        └─ custom records
             │
             ▼
Pi context-source window
             │
             ▼
future provider request construction
~~~

The context-source window is **not** the final provider-visible prompt.

That distinction matters. History can survive even when it no longer contributes to the next request, and compaction is a projection boundary rather than a rewrite of what happened.

A future richer context inspector may explain more of the final request assembly, but it should never invent parity where the runtime does not expose it.

## Steering and control

Long-running agents need richer interaction than another generic chat message.

Endophasia currently implements three bounded steering operations:

~~~text
STEER   → Pi steer queue
QUEUE   → Pi follow-up queue
STOP    → abort request for the run Endophasia actually observed
~~~

Receipts report acceptance or request state. They do not claim that queued text was later consumed or that an aborted run reached a particular terminal state.

Runtime Control Deck v0 separately exposes concrete lane configuration:

~~~text
configured model
thinking level
active tools
open operation
~~~

Setters perform a Pi mutation followed by readback. They are not transactions.

A configuration change applies to later generation snapshots; an in-flight provider request keeps the configuration it already captured.

Broader controls such as Epistemic Rigour, Explore, Verify, Compute Appetite, and Work / Dream remain policy concepts. They should eventually compile to explicit runtime changes where a substrate can actually support them.

## Instruments and evidence

If ordinary software can establish something mechanically, Endophasia should prefer that instrument before asking a model to judge itself.

Implemented read-only instruments already include:

~~~text
Mission Trace
Session Overview
Continuity
Durable Outcomes
Runtime Metrics
Usage Ledger
Usage Feed
Control State
~~~

They intentionally preserve distinctions such as:

~~~text
cumulative accounting ≠ current context
accepted work         ≠ terminal outcome
usage row             ≠ causal attribution
configured model      ≠ captured in-flight model
runtime record        ≠ epistemic standing
~~~

A useful future hierarchy remains:

~~~text
deterministic observation
        ↓
derived measurement
        ↓
independent verification
        ↓
model interpretation
~~~

Evidence should retain **how it was obtained**.

## Runtime v0

Pi is the **current concrete runtime**, not yet one interchangeable adapter behind a finished Endophasia runtime contract.

The implemented path is:

~~~text
trusted host
    │
    ▼
startEndophasiaServer()
    │
    ▼
Pi experimental server
    │
    ▼
SessionWorkerManager
    │
    ▼
Endophasia Session-worker entry
    │
    ▼
normal coding-agent worker bootstrap
    │
    ├─ ModelRuntime
    ├─ SettingsManager
    ├─ tools
    ├─ AgentHarness
    ├─ main lane
    ├─ reloadable Session plugins
    │
    └─ trusted Endophasia Inspector facet
             │
             ▼
      Chord Session services
             │
             ▼
         ordinary Pi client
~~~

The Endophasia application layer is deliberately **source-only** in <code>packages/endophasia/runtime/</code>.

The built private <code>@endophasia/core</code> library remains separate from coding-agent's experimental server / worker internals.

Runtime v0 does not create a second harness implementation. The custom Endophasia worker reuses Pi's normal coding-agent worker bootstrap, then contributes the Inspector as a trusted host facet.

Reloadable Session plugins still receive only the Chord facet environment; they do not gain ambient <code>AgentHarness</code> authority.

## Chord and presentation surfaces

Chord is already part of Runtime v0.

The current Inspector path is:

~~~text
AgentHarness
    │
    ▼
createEndophasiaInspectorFacetV0()
    │
    ▼
trusted worker host facet
    │
    ▼
Chord remote service
    │
    ▼
Pi Session routing
    │
    ▼
ordinary client
~~~

Today the remote Inspector exposes only **Session Overview v0**.

The other Endophasia projections remain library surfaces until each one earns a narrow remote contract.

That gives the next presentation experiment a useful shape:

~~~text
Pi / Endophasia runtime
        │
        ├─ transcript + ordinary Pi services
        └─ Endophasia Inspector
                 │
                 ▼
        browser / desktop cockpit
~~~

The cockpit should be a projection and control surface, never a second source of truth.

Browser transport is still an open design choice in this fork. Upstream has explored web and WebSocket approaches, but Endophasia should not assume a stable upstream browser transport until one exists. WebMCP is better treated as a later progressive enhancement for selected browser-side tools, not as the foundation of the runtime or authority model.

## WORK / DREAM

<table>
<tr>
<td width="50%" valign="top">
<sub>WORK</sub><br><br>
<strong>Convergent execution</strong><br><br>
One primary trajectory. Bounded exploration. Deterministic checks early. Selective review. Optimized for getting the task done without spending compute merely because it is available.
</td>
<td width="50%" valign="top">
<sub>DREAM</sub><br><br>
<strong>Exploratory cognition</strong><br><br>
Broader retrieval. More hypotheses retained. Counterfactuals. Stronger falsification. Optional independent challenge. White-box experiments where supported.
</td>
</tr>
</table>

Work / Dream is **not implemented policy yet**.

It is a future policy layer for changing how aggressively the system explores, verifies, delegates, and spends compute while keeping authority unchanged.

~~~text
more cognition ≠ more authority
more branches  ≠ more truth
more agreement ≠ more permission
~~~

## Plans are not effects

A model proposal should be inspectable before it becomes consequential.

~~~text
model intent
    │
    ▼
structured proposal
    │
    ▼
inspectable plan
    │
    ▼
review / policy
~~~

A valid plan is still only a proposal.

The intended consequential-action boundary remains:

~~~text
agent
  │ proposes
  ▼
plan
  │
  ▼
DEADBOLT
  ├─ typed route
  ├─ policy
  ├─ lease
  ├─ confirmation
  └─ receipt
       │
       ▼
real effect
~~~

Upstream Pi intentionally does not provide a built-in permission system that turns tool execution into an external authority boundary. Extension hooks can be useful policy; they are not automatically the root of authority.

## Operational state is not epistemic memory

Pi operational history, Mission Trace, and future Magpie evidence answer different questions.

~~~text
Pi runtime
  sessions
  lanes
  operations
  usage
  tools

Endophasia
  runtime projections
  steering/control semantics
  presentation surfaces

Pallium
  future cognition / coordination policy

Magpie
  claims
  evidence
  provenance
  epistemic standing

Deadbolt
  authority
  permission
  effects
  receipts
~~~

Persistence does not make a claim true.

Execution does not make a result authoritative.

Human approval does not automatically make a proposition epistemically settled.

## Architecture

~~~mermaid
flowchart TB
    H["Human"] --> PRES["Presentation\nTUI today · richer cockpit next"]

    PRES --> CLIENT["Pi client / Session attachment"]
    CLIENT --> ER["Endophasia Runtime v0\nsource-only server + worker entry"]
    ER --> PI["Pi Session worker\nnormal coding-agent bootstrap"]
    PI --> AH["AgentHarness / lanes"]

    AH --> CORE["Endophasia core projections\nMission Trace · Continuity · Steering\nOverview · Outcomes · Metrics · Usage · Control"]
    AH --> INS["Inspector host facet"]
    INS --> CH["Chord remote service\nendophasia.inspector.v0"]
    CH --> CLIENT

    CORE -. future policy / orchestration .-> P["Pallium\ncognition · coordination · evaluation"]
    CORE -. future evidence adapters .-> M["Magpie\nprovenance · epistemic standing"]
    P -. proposals .-> D["Deadbolt\nauthority · consent · capability"]
    D -. authorised effects .-> FX["Consequential effect"]
    FX -. receipts / observations .-> M
    FX -. runtime observations .-> CORE

    AH -. compatible local runtimes .-> J["J-space / latent instrumentation"]
~~~

### The boundary matters

| Layer | Owns today / intended ownership | Must not silently become |
| :--- | :--- | :--- |
| **Endophasia core** | Versioned runtime projections and bounded steering/control semantics. | Truth, hidden chain-of-thought, or execution authority. |
| **Endophasia runtime** | Trusted application composition of Pi server/worker plus host facets. | A second epistemic store or a plugin escape hatch. |
| **Pi runtime** | Sessions, lanes, model/tool execution, durable operational records, remote routing. | Root of trust merely because it executes. |
| **Presentation client** | Human-visible projections and future controls. | Canonical state. |
| **Pallium** | Future cognition/coordination policy and evaluation. | Canonical epistemic history or permission. |
| **Instruments** | Measurements and bounded observations. | General reasoning agents. |
| **Magpie** | Evidence, provenance, replayable epistemic history, standing. | General orchestration. |
| **Deadbolt** | Consequential-action authority and receipts. | Cognition or memory. |
| **Local latent layer** | Optional white-box observation/intervention. | Proof that an interpretation is true. |

## J-space

J-space is the deliberately white-box edge of the project.

Where compatible local runtimes expose internal state, Endophasia may eventually experiment with latent readouts and interventions.

~~~text
model state → instrumentation → projection → J-SPACE VIEW
~~~

The projection is a view, not the representation itself.

For API-only models, **UNAVAILABLE** is better than fake parity.

J-space is research instrumentation, not the foundation of the system.

## Current boundary

Endophasia remains an experimental fork of the live [Pi](https://github.com/earendil-works/pi) codebase, but it is now beyond the initial substrate-migration stage.

The implemented boundary is:

~~~text
@endophasia/core
  versioned projections and bounded control semantics
        │
        └── no UI, no epistemic authority, no action authority

packages/endophasia/runtime/
  source-only application composition
        │
        ├── startEndophasiaServer()
        ├── Endophasia Session-worker entry
        └── Inspector installed as trusted host facet

real Pi multiprocess runtime
        │
        └── ordinary Pi client can discover and invoke
            endophasia.inspector.v0
~~~

Important limitations remain explicit:

- only Session Overview v0 is remotely exposed through Inspector v0;
- Session Overview is per-lane consistent, not a session-wide atomic snapshot;
- Continuity v0 exposes a compaction-bounded context-source window, not the exact provider-visible prompt;
- Steering and Control receipts record acceptance/readback, not eventual execution or success;
- Runtime Metrics and usage surfaces are accounting projections, not causal attribution or provider invoices;
- Runtime v0 is source-only and follows Pi's experimental server / worker path;
- the custom Session-worker entry governs newly launched workers; replacement-server discovery does not attest worker provenance;
- automatic cold activation does not carry the custom entry;
- compiled Bun cannot launch an external custom entry through the current Pi process helper;
- there is no browser cockpit, Magpie adapter, Deadbolt authority path, Pallium policy engine, generic runtime-adapter API, or J-space implementation yet.

That boundary is intentional: implemented observations should stay smaller than the claims the interface eventually wants to make.

## Roadmap

The foundation sequence through the first real runtime is now complete:

~~~text
Mission Trace
  ↓
Continuity
  ↓
Steering
  ↓
Session Overview
  ↓
Durable Outcomes + Runtime Metrics + Usage
  ↓
Runtime Control Deck
  ↓
Chord Inspector
  ↓
trusted host-facet / custom-worker seams
  ↓
Endophasia Runtime v0
~~~

The next useful sequence is presentation-first and initially read-only:

~~~text
1  browser / presentation transport proof
     ordinary client attaches to Endophasia Runtime v0
     and consumes typed Session services

2  read-only cockpit v0
     Session Overview + existing Pi transcript/model state
     with no new canonical state

3  selectively widen read-only remote projections
     Continuity / metrics / outcomes / usage only where
     each service contract remains narrow and honest

4  explicit interaction boundary
     expose steering/control only with receipts and
     capability semantics preserved across transport

5  Work / Dream + selective challenge policy
     likely where Pallium begins to earn a concrete role

6  Magpie read-only evidence adapter
     then governed epistemic contribution rather than
     treating runtime state as belief

7  Deadbolt-backed consequential action path
     proposal → authority → effect → receipt

8  optional WebMCP presentation enhancement
     useful browser-side tools, never the root authority path

9  additional runtime adapters

10 local white-box / J-space research
~~~

The first product-shaped demonstration is now smaller and clearer than the original all-layer vision:

~~~text
real Pi Session
   ↓
Endophasia runtime
   ↓
typed observations
   ↓
read-only cockpit
   ↓
human understands what is happening
~~~

Only after that surface is trustworthy should Endophasia add richer policy, epistemic memory, or consequential authority.

## Upstream

Endophasia is an independent experimental fork of [Pi](https://github.com/earendil-works/pi).

The intent is to stay close enough to upstream that Pi remains recognizable and updateable. Endophasia-specific semantics should prefer narrow packages, projections, host facets, and application composition over invasive changes to the underlying agent loop.

~~~text
Pi
 │
 ├─ agent runtime
 ├─ providers
 ├─ sessions / lanes
 ├─ tools / extensions
 ├─ remote client / protocol
 ├─ server / Session workers
 ├─ Chord
 └─ telemetry / durable primitives
        │
        ▼
   Endophasia
        │
        ├─ versioned runtime projections
        ├─ bounded steering / control
        ├─ Chord Inspector
        ├─ source-only Pi runtime composition
        └─ future cognition / evidence / governance layers
~~~

For upstream Pi usage, development, package documentation, and contribution rules, see:

- [Pi repository](https://github.com/earendil-works/pi)
- [Pi documentation](https://pi.dev/docs/latest)
- [Pi SDK](https://pi.dev/docs/latest/sdk)
- [Pi extensions](https://pi.dev/docs/latest/extensions)
- [local <code>AGENTS.md</code>](AGENTS.md) for inherited repository development rules

Unless Endophasia explicitly changes a package contract, upstream Pi documentation remains the reference for that package.

## Name

*Endophasia* refers to inner speech: language carried internally rather than spoken aloud.

The project is interested in what happens around a model before the final answer appears — but only where those processes can be exposed honestly.

The interface should illuminate computation.

It should not invent cognition for decoration.

---

**Status:** experimental · research-first · Pi-based · real multiprocess runtime v0 · upstream-aware
