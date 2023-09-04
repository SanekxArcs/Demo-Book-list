import { BookProvider } from "./components/BookContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Main from "@/components/Main";
import Footer from "@/components/Footer";

function App() {
  return (
    <BookProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="grid grid-rows-[20svh_75svh_5svh] h-[100svh]">
          <Header/>
          <Main/>
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    </BookProvider>
  );
}

export default App;
