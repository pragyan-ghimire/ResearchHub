export type Paper = {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  imageUrl: string;
  pdfUrl: string;
  bookmarked: boolean;
  uploadDate: string;
  tags: string[];
  categories: string[];
  uploaderId?: string;
};

const papers: Paper[] = [
  {
    id: '1',
    title: 'Advancements in Machine Learning for Semantic Search',
    authors: ['Alex Johnson', 'Maria Garcia'],
    abstract: 'This paper explores recent advancements in machine learning models, particularly transformers and deep neural networks, to improve semantic search capabilities. We propose a new architecture that outperforms existing models on benchmark datasets.',
    imageUrl: 'https://picsum.photos/seed/1/600/400',
    pdfUrl: '/placeholder.pdf',
    bookmarked: true,
    uploadDate: '2023-10-26',
    tags: ['Machine Learning', 'AI', 'Semantic Search'],
    categories: ['Technology', 'Artificial Intelligence'],
    uploaderId: 'user-123',
  },
  {
    id: '2',
    title: 'A Novel Approach to Quantum-Resistant Cryptography',
    authors: ['Chen Wei', 'Fatima Al-Jamil'],
    abstract: 'With the rise of quantum computing, traditional cryptographic methods are at risk. This research introduces a novel lattice-based cryptographic algorithm designed to be resistant to attacks from both classical and quantum computers.',
    imageUrl: 'https://picsum.photos/seed/2/600/400',
    pdfUrl: '/placeholder.pdf',
    bookmarked: false,
    uploadDate: '2023-10-22',
    tags: ['Quantum Computing', 'Cryptography', 'Security'],
    categories: ['Technology', 'Security'],
  },
  {
    id: '3',
    title: 'Efficient Data Structures for Large-Scale Graph Processing',
    authors: ['Samuel Jones', 'Priya Patel'],
    abstract: 'We present a new set of data structures optimized for processing large-scale graphs with billions of vertices and edges. Our approach minimizes memory footprint while maintaining high-speed query performance for complex graph algorithms.',
    imageUrl: 'https://picsum.photos/seed/3/600/400',
    pdfUrl: '/placeholder.pdf',
    bookmarked: true,
    uploadDate: '2023-09-15',
    tags: ['Data Structures', 'Algorithms', 'Big Data'],
    categories: ['Computer Science', 'Data Management'],
    uploaderId: 'user-123',
  },
  {
    id: '4',
    title: 'Decentralized Identity Management using Blockchain Technology',
    authors: ['Tariq Ahmed', 'Olga Ivanova'],
    abstract: 'This paper outlines a framework for decentralized identity management leveraging blockchain technology. The system provides users with self-sovereign identity, enhancing privacy and security compared to traditional centralized models.',
    imageUrl: 'https://picsum.photos/seed/4/600/400',
    pdfUrl: '/placeholder.pdf',
    bookmarked: false,
    uploadDate: '2023-08-01',
    tags: ['Blockchain', 'Identity Management', 'Decentralization'],
    categories: ['Technology', 'Security'],
  },
  {
    id: '5',
    title: 'CRISPR-Cas9 Gene Editing: A Review of Potentials and Challenges',
    authors: ['Dr. Evelyn Reed', 'Dr. Kenji Tanaka'],
    abstract: 'A comprehensive review of the CRISPR-Cas9 gene-editing tool, its applications in treating genetic disorders, agricultural advancements, and the ethical challenges and technical hurdles that need to be addressed for its widespread use.',
    imageUrl: 'https://picsum.photos/seed/5/600/400',
    pdfUrl: '/placeholder.pdf',
    bookmarked: false,
    uploadDate: '2023-11-05',
    tags: ['Bioinformatics', 'Gene Editing', 'CRISPR'],
    categories: ['Biology', 'Medicine'],
  },
  {
    id: '6',
    title: 'Zero-Day Threat Detection Using Anomaly-Based Intrusion Detection Systems',
    authors: ['David Miller', 'Chloe Kim'],
    abstract: 'This research focuses on the development of an anomaly-based intrusion detection system (IDS) that uses machine learning to identify and mitigate zero-day threats in real-time, providing a significant improvement over signature-based systems.',
    imageUrl: 'https://picsum.photos/seed/6/600/400',
    pdfUrl: '/placeholder.pdf',
    bookmarked: true,
    uploadDate: '2023-07-18',
    tags: ['Cyber Security', 'AI', 'Threat Detection'],
    categories: ['Technology', 'Security'],
  },
  {
    id: '7',
    title: 'The Impact of Deep Neural Network Architectures on Computer Vision',
    authors: ['Sophie Dubois', 'Ben Carter'],
    abstract: 'This paper analyzes the evolution of deep neural network architectures and their transformative impact on the field of computer vision. We compare models like CNNs, ResNets, and Vision Transformers on various image recognition tasks.',
    imageUrl: 'https://picsum.photos/seed/7/600/400',
    pdfUrl: '/placeholder.pdf',
    bookmarked: false,
    uploadDate: '2023-10-30',
    tags: ['Neural Networks', 'Computer Vision', 'AI'],
    categories: ['Technology', 'Artificial Intelligence'],
    uploaderId: 'user-123',
  },
  {
    id: '8',
    title: 'Modeling Climate Change Effects on Arctic Ecosystems',
    authors: ['Liam Smith', 'Aisha Khan'],
    abstract: 'Our study uses advanced climate modeling to project the long-term effects of global warming on Arctic ecosystems. We focus on sea ice decline, permafrost thaw, and the impact on indigenous wildlife populations.',
    imageUrl: 'https://picsum.photos/seed/8/600/400',
    pdfUrl: '/placeholder.pdf',
    bookmarked: false,
    uploadDate: '2023-09-02',
    tags: ['Climate Change', 'Ecosystems', 'Modeling'],
    categories: ['Environmental Science', 'Climate'],
  },
];

export function getPapers(): Paper[] {
  return papers;
}

export function getPaperById(id: string): Paper | undefined {
  return papers.find((paper) => paper.id === id);
}

export function getBookmarkedPapers(): Paper[] {
  return papers.filter((paper) => paper.bookmarked);
}

export function getUploadedPapersByUserId(userId: string): Paper[] {
    return papers.filter(paper => paper.uploaderId === userId);
}
