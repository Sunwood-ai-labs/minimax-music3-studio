import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { Music3LibraryPage } from "./pages/Music3LibraryPage";
import { StudioPage } from "./pages/StudioPage";
import { Music3SystemPage } from "./pages/Music3SystemPage";
import { useMusic3Workspace } from "./lib/useMusic3Workspace";

export default function App() {
  const workspace = useMusic3Workspace();
  return (
    <AppShell serviceState={workspace.serviceState} activeCount={workspace.metrics.active}>
      <Routes>
        <Route path="/" element={<StudioPage workspace={workspace} />} />
        <Route path="/library" element={<Music3LibraryPage workspace={workspace} />} />
        <Route path="/system" element={<Music3SystemPage workspace={workspace} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
