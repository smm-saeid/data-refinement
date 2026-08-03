# Custom Snackbar System (React + MUI)

This document describes a reusable **Snackbar system** using **Material-UI** and **React Context**, with support for:

- Multiple stacked snackbars
- Open snackbars from anywhere in your app
- Snackbar positioning on the **bottom left**
- Custom variants (`success`, `error`, `info`, `warning`)
- Auto-dismiss after configuration duration

---

## Installation

Make sure you have the required dependencies installed:

```bash
npm install @mui/material @emotion/react @emotion/styled