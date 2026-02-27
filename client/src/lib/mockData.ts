export interface Project {
  id: string;
  name: string;
  status: "running" | "stopped" | "failed";
  stack: "React" | "Vue" | "Node" | "Unknown";
  lastUpdated: string;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj_1",
    name: "E-Commerce Dashboard",
    status: "running",
    stack: "React",
    lastUpdated: "2024-03-20T10:00:00Z"
  },
  {
    id: "proj_2",
    name: "Portfolio V2",
    status: "stopped",
    stack: "Vue",
    lastUpdated: "2024-03-19T14:30:00Z"
  },
  {
    id: "proj_3",
    name: "API Gateway",
    status: "failed",
    stack: "Node",
    lastUpdated: "2024-03-18T09:15:00Z"
  }
];

export const MOCK_LOGS = [
  "> Starting development server...",
  "> vite v5.0.0 ready in 340 ms",
  " ",
  "  ➜  Local:   http://localhost:5000/",
  "  ➜  Network: use --host to expose",
  "  ➜  press h to show help",
  "",
  "9:40:02 AM [vite] hmr update /src/App.tsx",
  "9:40:05 AM [vite] hmr update /src/index.css"
];

export const MOCK_FILE_TREE = [
  { name: "src", type: "folder", children: [
    { name: "App.tsx", type: "file" },
    { name: "main.tsx", type: "file" },
    { name: "index.css", type: "file" },
    { name: "components", type: "folder", children: [
      { name: "Button.tsx", type: "file" }
    ]}
  ]},
  { name: "package.json", type: "file" },
  { name: "vite.config.ts", type: "file" },
  { name: "README.md", type: "file" }
];
