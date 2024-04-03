# Pinshelf
Learn about how this project was set up: [Project Setup Guide](./docs/SETUP.md)  
Architecture insights: [Architecture](./docs/ARCHITECTURE.md)  
Deployment notes: [Deployment](./docs/DEPLOYMENT.md)  

# Development
## Prerequisites
-   `pnpm` (an alternative to `npm` which provides workspace functionality)

## How to get started?
1.  Clone this repository and `cd ...` into the repository's directory
2.  `pnpm install`
3.  `pnpm ui:dev`
4.  Visit `http://localhost:5173`

## How to add shadcn-ui components
1.  Make sure to be in `apps/ui` (else `cd apps/ui`)
2.  `pnpx shadcn-svelte@latest add <component_name>`
