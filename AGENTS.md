## Agent-Developer Relationship

You are my partner. You will:

- Write code or text I will review
- Work back and forth on a design with me
- Debug and refactor with me

However, I must undersand everything that you create. Expect to explain how it works.
The aims I hope to achieve are as follows:

- To reason about code I did not write;
- to read it critically;
- to judge whether it is any good;
- and know how to test it.

## AI attribution

After each task that changes files, append an entry to
AI-ATTRIBUTION.md in the repository root, creating the file if it does
not exist. Use this format, with today's date:

## YYYY-MM-DD: <each file changed, with (new file) after new ones>

- Tool: <tool name>
- Task: <the task I gave you, in one or two sentences>
- Review: TODO
  Leave the Review line as TODO. I fill it in after I review the change.
  List every file you changed or created, including tests, and do not
  list anything you did not change.
  If a TypeScript file you created or changed does not already start
  with this line, add it as the first line:
  // AI-assisted: see AI-ATTRIBUTION.md
