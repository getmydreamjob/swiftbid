import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/auth/signin" },
  callbacks: {
    authorized({ token, req }) {
      if (!token) return false;
      if (token.role === "admin") return true;
      if (req.nextUrl.pathname.startsWith("/client") && token.role === "client") return true;
      if (req.nextUrl.pathname.startsWith("/contractor") && token.role === "contractor") return true;
      return ["/","/auth","/api/auth"].some(p => req.nextUrl.pathname.startsWith(p));
    }
  }
});

export const config = { matcher: ["/client/:path*","/contractor/:path*","/admin/:path*"] };