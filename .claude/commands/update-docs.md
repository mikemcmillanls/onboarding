# Update Documentation Command

Review all changes made during the current session and update documentation as needed.

## Process

1. **Analyze Session Changes**:
   - Review all code changes, file additions/deletions, and modifications made during this session
   - Use `git diff` and `git status` to identify what has changed
   - Understand the purpose and impact of each change

2. **Identify Documentation Impact**:
   - Determine if changes affect:
     - Project architecture or structure
     - Component functionality or APIs
     - User flows or workflows
     - Setup/installation instructions
     - Design system or UI patterns
     - Product requirements or features

3. **Update Affected Documentation**:
   - **CLAUDE.md**: Update if changes affect:
     - Project overview or architecture
     - Key components or integration points
     - Data flow or critical requirements
     - Implementation phases or open questions

   - **README.md**: Update if changes affect:
     - Project description or setup instructions
     - Getting started steps
     - Available features or functionality
     - Prerequisites or dependencies

   - **docs/ folder**: Update relevant files if changes affect:
     - `docs/01-product/PRODUCT_REQUIREMENTS.md`: Feature changes or new requirements
     - `docs/02-design/`: UI/UX changes, user flows, design specifications
     - `docs/03-implementation/`: Architecture or component changes
     - `docs/04-reference/`: Design system or API reference updates

4. **Summarize Updates**:
   - List all documentation files that were updated
   - Explain what was changed and why
   - Note any documentation that may need human review or additional detail

## Important Notes

- Only update documentation that is actually affected by the session changes
- Maintain consistency with existing documentation style and format
- Preserve existing structure and organization
- If unsure whether a change warrants documentation updates, err on the side of updating
- Do not remove or overwrite content unless the changes explicitly obsolete it
