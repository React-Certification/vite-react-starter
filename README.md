---
difficulty: 1
tags: codechallenge, Exercise Challenge
openFiles: src/App.jsx
---

# Cert Template Code Challenge

## Challenge Description

This project has a template for a simple packing list application that helps users track items they need for a trip.

Your task is to implement the core functionality of the packing list app.

## Requirements

- On initial load, the app should display the three items in `initialItems`.
- Implement the "Add Item" functionality. New items should be added with `packed: false` by default.

> 💡 HINT: Use the variable `let nextId = 3` to assign unique IDs to new items when adding them to the list. Increment `nextId` after each use to ensure IDs remain unique.

- Implement the toggle functionality. Make checkboxes functional to toggle the packed status of each item.
- Implement the delete functionality. Each items delete button should remove that item from the list.
- Implement the status text. The status text should display the number of packed items out of the total number of items in the list. The status text should update when items are added, removed, or their packed status changes.

When you complete the challenge, you should have something that looks like this:

![Screenshot of the solution](./screenshot.gif)

## Other Considerations

- If you see the `data-testid` attribute in the boilerplate don't remove it. If you remove it, your code may be invalid for the certificate.
- TailwindCSS is preinstalled and includes default styles and semantic classes, found in `index.css`. It might be helpful for you, if you want to have some styles.
- It is NOT necessary to have the exact same styles as in the GIF above, or even any styles at all.
- Your code will be linted and must be clean of anti-patterns. Follow best practices.
