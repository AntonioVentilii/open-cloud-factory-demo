# .factory

The factory's agent door, versioned with the code.

- `skill/open-cloud-factory/`, the Claude Code skill every factory agent loads
  (`SKILL.md` = protocol; `agents/*.md` = one prompt per stage). Install:

      ln -s "$PWD/.factory/skill/open-cloud-factory" ~/.claude/skills/open-cloud-factory

  then in any Claude Code session: `/open-cloud-factory`.

Changes to `agents/*.md` are the factory learning. The retro agent proposes
them on the board; a human lands them here as a normal PR.
