
import middleware from "next-auth/middleware";

export default middleware;

export const config = {
    // *: zero or more parameters
    // +: one or more parameters
    // ?: zero or one parameters
    matcher: ['/dashboard/:path*','/bookmarks','/upload']
    
}