---
name: documentation
description: Write clear, structured process documentation including purpose, prerequisites, steps, decision trees, and examples
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill produces structured process documentation that any team member can follow without help from the person who wrote it. Good process docs eliminate key-person dependency, reduce onboarding time, and prevent recurring errors. This skill applies consistent structure, decision-tree logic where processes branch, and examples that make abstract steps concrete.

## When to Use
- Documenting a recurring marketing process for the first time
- Updating an existing process document after a process change
- Onboarding a new team member, freelancer, or agency
- When an error occurred because a step wasn't documented
- As part of ops-planning to reduce undocumented process risk
- When a process needs to be handed off to a different owner

## How to Execute

### Step 1: Define the Process Scope
Before writing, clarify:
- **Process name**: What is this called? (Use the name the team actually uses, not a formal title)
- **Process owner**: Who is responsible for this process running correctly?
- **Frequency**: Is this done daily, weekly, per campaign, per event, on-demand?
- **Trigger**: What starts this process? (A campaign brief arrives / the calendar hits day 1 of the month / a lead reaches a certain score)
- **End state**: How do you know the process is complete? What is the output?

### Step 2: Interview the Current Owner
If documenting an existing (undocumented) process, work with the person who currently does it:
- Walk through the process step by step
- Ask: "What do you check before starting? What tools do you open? What can go wrong?"
- Ask about exceptions: "Are there cases where you do it differently?"
- Ask about decisions: "At what points do you make a judgment call, and what does that depend on?"

Capture everything — you'll organize it in the next step.

### Step 3: Structure the Document

**Standard Document Structure**:

```
# [Process Name]

## Purpose
[One paragraph: what this process achieves, and why it matters]

## Owner
[Name or role]

## Frequency
[How often this runs]

## Prerequisites
[What must be true / in place before starting this process]
- Access to [tool/system]
- [Data or input] must be ready
- [Dependency] must be completed first

## Process Steps
[Numbered steps. Each step = one action. Not one step = three things.]

## Decision Points
[For any step where the action depends on a condition]

## Common Mistakes
[What goes wrong, and how to avoid it]

## Examples
[One or two concrete worked examples]

## Related Processes
[Links to upstream and downstream processes]

## Version History
[Date | Change | Author]
```

### Step 4: Write the Steps
Rules for writing good process steps:
- **One action per step**: "Open HubSpot, navigate to Contacts, and filter by lifecycle stage" is three steps, not one.
- **Start each step with a verb**: "Export", "Check", "Create", "Send", "Upload", "Verify"
- **Include the what, where, and (when non-obvious) why**: "Click 'Publish' in WordPress (not 'Save Draft') to make the post live"
- **Specify the expected outcome** for any step that could fail silently: "The export should contain at minimum [X] rows. If fewer, check the date filter."
- **No assumed knowledge**: Write for someone competent but new to this specific process.

### Step 5: Add Decision Trees for Branching Logic
Whenever the process has a conditional ("if X, do Y; if not X, do Z"), use a decision tree or explicit if/then formatting:

```
Step 7: Check the lead qualification score.
  → If score ≥ 8: Route to SDR queue (see Step 8A)
  → If score 5-7: Add to marketing nurture sequence (see Step 8B)
  → If score < 5: Tag as "Unqualified" and close (no further action)
```

Do not bury conditional logic in paragraph prose — it gets missed.

### Step 6: Add Examples
For every process that involves judgment or could be misunderstood, add a worked example:
- Show what a correct execution looks like end-to-end
- For data processes, show an example input and the expected output
- For writing processes, show a filled-out template

### Step 7: Set a Review Cadence
Add to the document header:
- Last reviewed: [date]
- Next review due: [date — quarterly for active processes, semi-annual for stable ones]
- What should trigger an unscheduled review: "Review if the tool changes, the team structure changes, or an error is traced to this process"

## Output Format

Deliver the full process document using the standard structure above:

```
# [Process Name]

**Owner**: [name/role]
**Frequency**: [cadence]
**Last Reviewed**: [date]
**Next Review**: [date]

---

## Purpose
[paragraph]

## Prerequisites
- [item]
- [item]

## Process Steps
1. [Verb + action + location/tool]
2. [Verb + action + expected outcome]
3. [Verb + action]
   → If [condition]: [action]
   → If [other condition]: [action]
...

## Common Mistakes
- **[Mistake]**: [How to avoid or catch it]

## Worked Example
[Concrete example]

## Related Processes
- [Upstream process name] → links to this process
- This process → [Downstream process name]

## Version History
| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | [date] | [name] | Initial documentation |
```
