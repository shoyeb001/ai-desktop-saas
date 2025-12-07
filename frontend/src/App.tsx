import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import ArticleWriter from "./pages/ai-article/articlewriter";
export default function App() {
  return (
    <Routes>
      {/* Default / first screen */}
      <Route path="/" element={<HomePage />} />
      <Route path="/article-writer" element={<ArticleWriter />} />
    </Routes>
  );
}
