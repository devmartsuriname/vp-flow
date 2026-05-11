# VP-Flow — Claude Code Hooks

Hooks run automatically at Claude Code lifecycle events.

## Current Hooks

No hooks are active yet. This folder is reserved for future hooks.

## Planned Hooks (require TC to implement)

- pre-tool-use: Warn before any Write/Edit on frozen files
- post-tool-use: Remind to create restore point after significant changes
- notification: Alert Delroy when a TC task is completed

## Hook Format

Hooks are defined in .claude/settings.json under the "hooks" key.
See Claude Code documentation for hook syntax.
