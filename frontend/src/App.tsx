import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import ArticleWriter from "./pages/ai-article/articlewriter";
import SettingsPage from "./pages/settings/settings";
export default function App() {
  return (
    <Routes>
      {/* Default / first screen */}
      <Route path="/" element={<HomePage />} />
      <Route path="/article-writer" element={<ArticleWriter />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
