
// import { getPaperById } from '@/lib/data';
// import { notFound } from 'next/navigation';
// import Image from 'next/image';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Bookmark, Download, CalendarDays, Users } from 'lucide-react';
// import { format } from 'date-fns';

// type PaperPageProps = {
//   params: {
//     id: string;
//   };
// };

// export default function PaperPage({ params }: PaperPageProps) {
//   const paper = getPaperById(params.id);

//   if (!paper) {
//     notFound();
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid md:grid-cols-3 gap-8">
//         <div className="md:col-span-2">
//           <article>
//             <div className="mb-6">
//               <h1 className="text-4xl font-bold font-headline mb-4">{paper.title}</h1>
//               <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
//                 <div className="flex items-center gap-2">
//                   <Users className="h-4 w-4" />
//                   <span>{paper.authors.join(', ')}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <CalendarDays className="h-4 w-4" />
//                   <span>{format(new Date(paper.uploadDate), 'MMMM d, yyyy')}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="prose prose-lg dark:prose-invert max-w-none">
//               <h2 className="font-headline text-2xl">Abstract</h2>
//               <p>{paper.abstract}</p>
//             </div>
            
//             <div className="mt-8">
//                 <h3 className="font-headline text-xl mb-3">Categories</h3>
//                 <div className="flex flex-wrap gap-2">
//                     {paper.categories.map((category) => (
//                         <Badge key={category} variant="default" className="text-sm px-3 py-1">{category}</Badge>
//                     ))}
//                 </div>
//             </div>

//             <div className="mt-8">
//                 <h3 className="font-headline text-xl mb-3">Tags</h3>
//                 <div className="flex flex-wrap gap-2">
//                     {paper.tags.map((tag) => (
//                         <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">{tag}</Badge>
//                     ))}
//                 </div>
//             </div>

//             <div className="mt-12">
//               <h2 className="font-headline text-2xl mb-4">Paper Preview</h2>
//               <div className="aspect-[4/5] rounded-lg border overflow-hidden">
//                 <iframe src={paper.pdfUrl} width="100%" height="100%" />
//               </div>
//             </div>
//           </article>
//         </div>
//         <div className="md:col-span-1">
//           <div className="sticky top-24 space-y-4">
//             <div className="relative w-full aspect-video rounded-lg overflow-hidden border shadow-md">
//               <Image
//                 src={paper.imageUrl}
//                 alt={paper.title}
//                 fill
//                 className="object-cover"
//                 data-ai-hint="research paper abstract"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//                 <Button variant="outline" size="lg">
//                     <Bookmark className="mr-2 h-4 w-4" />
//                     Bookmark
//                 </Button>
//                 <Button size="lg" asChild>
//                     <a href={paper.pdfUrl} download>
//                     <Download className="mr-2 h-4 w-4" />
//                     Download
//                     </a>
//                 </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
