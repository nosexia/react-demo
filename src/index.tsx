import React, { Suspense, useMemo } from "react";
import ReactDOM from "react-dom";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import axios, { AxiosContext } from "./api/request";

import "./index.css";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import SuspendFallbackLoading from "./pages/layout/suspendFallbackLoading";

// import "core-js/stable";
// import "regenerator-runtime/runtime";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      //如果定义了suspense会导致页面一直在loading中，导致组件内部londing被过滤
      suspense: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchInterval: false,
    },
  },
});

//定义axios包裹组件，渲染provider传递axios
const AxiosProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  //避免跟组件刷新渲染导致axios的修改，所以使用useMemo
  const axiosValue = useMemo(() => {
    return axios;
  }, []);

  return (
    <AxiosContext.Provider value={axiosValue}>{children}</AxiosContext.Provider>
  );
};

ReactDOM.render(
  <AxiosProvider>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              There was an error!{" "}
              <button onClick={() => resetErrorBoundary()}>重试</button>
              <pre style={{ whiteSpace: "normal" }}>{error.message}</pre>
            </div>
          )}
        >
        <Suspense fallback={<SuspendFallbackLoading />}>
          <App />
        </Suspense>
        </ErrorBoundary>
      </RecoilRoot>
    </QueryClientProvider>
  </AxiosProvider>,
  document.getElementById("root")
);


