import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const ArticlePost = ({ postData }: { postData: any }) => {
  // const postData = {
  //   "title": "The Future of AI: What's Next for Humanity?",
  //   "description": "Curious about The Future of AI? We're taking a casual dive into upcoming tech, societal shifts, and the exciting potential, especially considering The Future of AI in India.",
  //   "article": "<p>Ever wonder what <strong>The Future of AI</strong> really looks like? It's not just the stuff of sci-fi movies anymore, is it? We're living in a time where AI is subtly, and sometimes not so subtly, weaving itself into the fabric of our everyday lives. Think about it – from recommending your next favorite song to helping doctors diagnose complex conditions, AI is quietly transforming our world.</p><p>What's truly fascinating is how this technological tide is shaping different cultures. Take, for instance, <strong>The Future of AI in India</strong>. It's not just about adopting Western models; it’s about innovating solutions that resonate with local challenges and opportunities. Imagine AI helping farmers predict crop yields in remote villages or optimizing urban traffic flow in bustling mega-cities. It’s a powerful tool, capable of immense good if wielded thoughtfully.</p><p>But here's a thought: as AI becomes more sophisticated, how do we ensure it remains a servant, not a master? It’s a conversation we all need to be a part of, isn't it? The beauty of AI isn't in replacing human ingenuity, but in augmenting it, freeing us up for more creative, empathetic pursuits. We're on the cusp of something truly monumental, and the choices we make now will define how truly beneficial this future becomes. It's an exciting, slightly daunting, but ultimately hopeful prospect.</p>",
  //   "seoKeywords": [
  //     "The Future of AI",
  //     "AI advancements",
  //     "Artificial Intelligence trends",
  //     "AI in India",
  //     "India AI future",
  //     "Tech innovation",
  //     "Digital transformation India",
  //     "AI impact on society",
  //     "Future technology"
  //   ],
  //   "imagePrompt": ""
  // }
  return (
    <aside className="w-[480px] border-l border-gray-800 p-8 overflow-y-auto hide-scrollbar bg-[#0f172a]">

      {/* IMAGE */}
      <Card className="bg-[#1e293b] border-none rounded-2xl overflow-hidden mb-6">
        <CardContent className="p-0">
          <img
            src="/ai-preview.png"
            alt="AI Preview"
            className="w-full object-cover"
          />
        </CardContent>
      </Card>

      {/* ARTICLE TEXT */}
      <div className="text-gray-200">
        <h3 className="text-xl font-bold mb-3">
          {postData?.title}
        </h3>

        <div className="text-gray-400 leading-7 text-sm" dangerouslySetInnerHTML={{ __html: postData?.article }}></div>

        <div className="flex w-full flex-wrap gap-2 mt-4">
          {
            postData?.seoKeywords?.map((keywords: any, index: number) => (
              <Badge variant="outline" key={index} className='text-white'>{keywords}</Badge>
            ))
          }
        </div>
      </div>

    </aside>
  )
}
