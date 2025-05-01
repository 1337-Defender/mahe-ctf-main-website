import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Helper function to check if a path should be considered public
const isPublicPath = (path: string): boolean => {
  // List your public paths here
  const publicPaths = [
    '/',          // Home page
    '/sign-in',   // Sign-in page
    '/sign-up',   // Sign-up page
    // Add any other public paths, e.g.:
    // '/about',
    // '/pricing',
  ];

  // Check for exact matches
  if (publicPaths.includes(path)) {
    return true;
  }

  // Check for patterns (e.g., auth callbacks, public API routes)
  if (path.startsWith('/auth/')) { // e.g., /auth/callback
    return true;
  }
  // Example: Allow specific public API routes if needed
  // if (path.startsWith('/api/public/')) {
  //   return true;
  // }

  // You might want to explicitly allow Next.js internals, although the matcher usually handles this
  // if (path.startsWith('/_next/')) {
  //   return true;
  // }

  return false;
};

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // protected routes
    if (!isPublicPath(request.nextUrl.pathname) && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
