import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Helper to get the base API URL based on environment
const getBaseApiUrl = () => {
  // In development, use the Netlify Dev server port
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8888';
  }
  // In production, use relative URLs
  return '';
};

// Helper to format API URL
const formatApiUrl = (url: string) => {
  const baseUrl = getBaseApiUrl();
  
  // If the URL already starts with http(s), return as is
  if (url.startsWith('http')) {
    return url;
  }

  // If we're in development, ensure we're using the Netlify Functions path
  if (process.env.NODE_ENV === 'development') {
    // If the URL starts with /api/, replace it with /.netlify/functions/api/
    if (url.startsWith('/api/')) {
      return `${baseUrl}/.netlify/functions/api/${url.slice(5)}`;
    }
    // If it doesn't start with /api/, add the full path
    return `${baseUrl}/.netlify/functions/api${url.startsWith('/') ? url : `/${url}`}`;
  }

  // In production, keep the /api/ prefix as it will be handled by Netlify redirects
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const formattedUrl = formatApiUrl(url);
  
  console.log(`Making ${method} request to:`, formattedUrl);
  
  const res = await fetch(formattedUrl, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      // Add any additional headers here
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Helper to throw error if response is not ok
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If JSON parsing fails, use status text
      errorMessage = res.statusText;
    }
    throw new Error(errorMessage);
  }
}

type UnauthorizedBehavior = "throw" | "returnNull";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const formattedUrl = formatApiUrl(queryKey[0] as string);
    
    console.log('Making query request to:', formattedUrl);
    
    const res = await fetch(formattedUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };
