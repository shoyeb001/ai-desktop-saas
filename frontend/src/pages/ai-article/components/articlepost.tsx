import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export const ArticlePost = ({ postData }: { postData: any }) => {
  return (
    <aside className="w-[480px] border-l border-gray-800 p-8 overflow-y-auto hide-scrollbar bg-[#0f172a]">
      {
        postData ? (

          <div className="text-gray-200">
            <p className='text-gray-400 text-sm text-center font-bold' >SEO Title</p>
            <h3 className="text-xl font-bold mb-3">
              {postData?.title}
            </h3>
            <Separator />
            <p className='text-gray-400 text-sm text-center font-bold' >SEO Description</p>
            <p className="text-sm  mb-3">
              {postData?.description}
            </p>
            <Separator />

            <div className="text-gray-400 leading-7 " dangerouslySetInnerHTML={{ __html: postData?.article }}></div>

            <div className="flex w-full flex-wrap gap-2 mt-4">
              {
                postData?.seoKeywords?.map((keywords: any, index: number) => (
                  <Badge variant="outline" key={index} className='text-white'>{keywords}</Badge>
                ))
              }
            </div>
          </div>
        ) : (
          <p className='text-center text-gray-400 text-sm'>Your generated article will appear here...</p>
        )
      }


      {/* ARTICLE TEXT */}


    </aside>
  )
}
