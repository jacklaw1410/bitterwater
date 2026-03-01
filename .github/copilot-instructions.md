# Svelte 101 Project Guidelines

## Core Principle
This is a Svelte 5 project. Your primary directive is to use Svelte 5 Runes for all reactive code.

## Context
Before starting any complex task, you MUST ground your understanding in our project's documentation:
- [Product Vision](../.github/docs/PRODUCT.md)
- [System Architecture](../.github/docs/ARCHITECTURE.md)

## Workflow
For any new feature or significant change, you MUST follow this sequence:
1.  Run the `@research` agent to gather task-specific context.
2.  Run the `@plan` agent, using the output from the research step.
3.  Run the `@implement` agent to write the code based on the approved plan.

Do not guess or assume. If the documentation is unclear, ask for clarification.
