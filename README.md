# ThatsTheSoundOfTheAlarm

## Overview

**ThatsTheSoundOfTheAlarm** is a React Native (Expo) app for managing alarms, focus timers, and dashboard widgets. It features a sidebar layout, theme switching (dark/light), and responsive navigation. The codebase is modular and ready for future expansion, such as local storage and cloud sync.

## Features

- **Sidebar Navigation**: Drawer-based sidebar with icons for Alarms, Focus Timer, and Dashboard.
- **Theme Switching**: Toggle between light and dark mode from both the header and sidebar.
- **Responsive Layout**: Drawer adapts to screen size and uses smooth animations.
- **Navigation**: Uses `expo-router` for route management.
- **Custom Styling**: Utility-first styling with support for theming.
- **Safe Area Support**: Handles device notches and safe areas.

> **Note:** SQLite/local storage is not implemented yet.

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

```bash
git clone git@github.com:aleksejunas/thats-the-sound-of-the-alarm.git
cd thats-the-sound-of-the-alarm
pnpm install
```

### Running the App

```bash
pnpm expo start
```

- Press `a` to run on Android, `i` for iOS, or open in a web browser.

## Project Structure

- `app/components/SidebarLayout.tsx`: Main layout with sidebar, header, and theme switch.
- `app/context/ThemeContext.tsx`: Theme state and toggle logic.
- `app/lib/styleUtils.ts`: Utility for themed styles.
- `app/`: Screens and navigation routes.

## Customization

- **Add new routes**: Update the `routes` array in `SidebarLayout.tsx`.
- **Change theme colors**: Edit theme context and style utilities.
- **Add storage**: Integrate SQLite or Firebase as needed.

## Contributing

1. Fork the repo and create a feature branch.
2. Make your changes and test locally.
3. Submit a pull request.

## License

MIT

---

_This project is in early development. Contributions and feedback are welcome!_
