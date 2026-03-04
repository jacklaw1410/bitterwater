# Svelte 101 Project Guidelines

## Core Principle

This is a Svelte 5 project. Your primary directive is to use Svelte 5 Runes for all reactive code.

## Context

Before starting any complex task, you MUST ground your understanding in our project's documentation:

- **Use Version Control**: Before modifying an existing file, use `git log` on that file to understand its history and the rationale behind previous changes.
- [Product Vision](../.github/docs/PRODUCT.md)
- [System Architecture](../.github/docs/ARCHITECTURE.md)
- [Testing Strategy and Rules](../.github/docs/TESTING.md)
- [Svelte Usages and Best Practices](../.github/docs/svelte-usages.md)
- [TypeScript Usages and Best Practices](../.github/docs/typescript-usages.md)

## Workflow

For any new feature or significant change, you MUST follow this sequence. Each step is performed by a specialized agent.

1. **Run the `Research` agent.**
   - **Primary Goal**: To gather all necessary context and perform initial discovery.
   - **Mandatory First Step**: Upon receiving a task, your first action is to read the `.github/context.json` file.
   - **Context Assembly**: Analyze the task description to identify keywords (e.g., "component", "test") and file paths. Use these to look up the corresponding documentation files listed in `context.json`.
   - **Context Loading**: Read the contents of all identified documentation files. This context is essential for your research.
   - **Research Execution**: Proceed with your research, grounding all your findings in the project's established best practices from the documents you have just read.

2. **Run the `Plan` agent.**
   - **Primary Goal**: To create a detailed, step-by-step implementation plan based on the research.
   - **Input**: The output from the Research agent.
   - **Action**: Review the research and the referenced context documents. Create a plan that adheres to all project guidelines.

3. **Run the `Implement` agent.**
   - **Primary Goal**: To write code based on the approved plan.
   - **Input**: The output from the Plan agent.
   - **Action**: Follow the plan precisely to implement the feature.

Do not guess or assume. If the documentation is unclear, ask for clarification.
