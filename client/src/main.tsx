import { UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import { Router as WouterRouter } from "wouter";

import { getApiUrl, hasExternalApi, routerBase } from "@/lib/runtime";
import { trpc } from "@/lib/trpc";

import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  if (error.message !== UNAUTHED_ERR_MSG) {
    return;
  }

  try {
    window.location.href = getLoginUrl();
  } catch (configurationError) {
    console.error(
      "[OAuth Configuration Error]",
      configurationError,
    );
  }
};

queryClient.getQueryCache().subscribe((event) => {
  if (
    event.type === "updated" &&
    event.action.type === "error"
  ) {
    const error = event.query.state.error;

    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if (
    event.type === "updated" &&
    event.action.type === "error"
  ) {
    const error = event.mutation.state.error;

    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

if (import.meta.env.PROD && !hasExternalApi) {
  console.info(
    "External API is not configured; public portfolio features remain available.",
  );
}

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: getApiUrl("/api/trpc"),
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider
    client={trpcClient}
    queryClient={queryClient}
  >
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={routerBase}>
        <App />
      </WouterRouter>
    </QueryClientProvider>
  </trpc.Provider>,
);