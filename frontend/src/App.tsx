import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import ArticleWriter from "./pages/ai-article/articlewriter";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default / first screen */}
        <Route path="/" element={<HomePage />} />
        <Route path="/article-writer" element={<ArticleWriter />} />

        {/* Add more screens here later */}
        {/* <Route path="/settings" element={<SettingsPage />} /> */}
        {/* <Route path="/humanizer" element={<Humanizer />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
