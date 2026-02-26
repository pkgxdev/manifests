# AGENTS: manifests

Public repository for package manifest generation and build scripts.

## Core Commands

- `pkg-build <pkg>`
- `pkg-test`

## Always Do

- Keep manifest generation deterministic.
- Validate changed manifest/build logic with representative package tests.

## Ask First

- Workflow contract changes used by other repos.
- Any changes that alter package selection semantics.

## Never Do

- Never skip tests for changed packaging logic.
- Never include internal-only policy notes in public docs.
