import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pdfUrl = searchParams.get('url');

  if (!pdfUrl) {
    return NextResponse.json(
      { error: 'PDF URL is required' },
      { status: 400 }
    );
  }

  try {
    // Decode the URL if it's encoded
    const decodedUrl = decodeURIComponent(pdfUrl);

    // Fetch the PDF from Cloudinary
    const response = await fetch(decodedUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch PDF from Cloudinary' },
        { status: response.status }
      );
    }

    // Get the PDF content
    const buffer = await response.arrayBuffer();

    // Extract filename from URL or use default
    const urlObj = new URL(decodedUrl);
    const filename = urlObj.pathname.split('/').pop() || 'document.pdf';

    // Return the PDF with download headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
