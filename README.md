# TVShowRenamer

A modern, cross-platform application for organizing and renaming TV show files with precision and ease. Built with Tauri and React, TVShowRenamer provides a user-friendly alternative to traditional file renaming tools, offering intelligent episode detection and consistent naming conventions.

## Features

- 🎯 Smart episode detection and matching
- 🎨 Modern, intuitive user interface
- 🔄 Batch renaming capabilities
- 📺 Integration with TMDB for accurate show information
- 🚀 Cross-platform support (Windows, macOS, Linux)

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/) package manager
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/TVShowRenamer.git
cd TVShowRenamer
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up your TMDB API key:
```bash
export TMDB_API_KEY=your_api_key_here
```

## Development

To run the application in development mode:

```bash
pnpm tauri dev
```

## Building

To create a production build:

```bash
pnpm tauri build
```

## License

MIT License - See LICENSE file for details