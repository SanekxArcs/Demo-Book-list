import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Footer = () => {
  return (
    <>
      <footer className="sticky bottom-o left-0 right-0 flex justify-center items-center gap-1">
        <a
          className="hover:text-slate-400 transition-all"
          href="https://github.com/SanekxArcs"
          target="_blank"
        >
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className=" text-muted-foreground">
                Made by Oleksandr Dzisiak
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/SanekxArcs" />
                  <AvatarFallback>OD</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div>
                    <h4 className="text-sm font-semibold">Oleksandr Dzisiak</h4>
                    <h4 className="text-sm font-semibold">@SanekxArcs</h4>
                    <p className="text-sm text-muted-foreground">
                      Introducing a React application developed with precision:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground">
                      <li className="text-sm">
                        Powered by
                        <span>
                          <a
                            href="https://vitejs.dev/"
                            target="_blank"
                            className=" underline mx-1"
                          >
                             Vite 
                          </a>
                        </span>
                        for seamless development workflow
                      </li>
                      <li className="text-sm">
                        Utilizing
                        <span>
                          <a
                            href="https://www.typescriptlang.org/"
                            target="_blank"
                            className=" underline mx-1"
                          >
                             TypeScript 
                          </a>
                        </span>
                        as the functional programming language of choice
                      </li>
                      <li className="text-sm">
                        Enhanced with
                        <span>
                          <a
                            href="https://ui.shadcn.com/"
                            target="_blank"
                            className=" underline mx-1 "
                          >
                             shadcn/ui 
                          </a>
                        </span>
                        components for a visually stunning design
                      </li>
                      <li className="text-sm">
                        Embellished with icons from
                        <span>
                          <a
                            href="https://lucide.dev/"
                            target="_blank"
                            className=" underline mx-1"
                          >
                             lucide-react 
                          </a>
                        </span>
                        library
                      </li>
                      <li className="text-sm">
                        Harnessing the capabilities of
                        <span>
                          <a
                            href="https://www.npmjs.com/package/uuid"
                            target="_blank"
                            className=" underline mx-1"
                          >
                             uuid 
                          </a>
                        </span>
                        for generating uniqueness
                      </li>
                      <li className="text-sm">
                        Efficiently integrating
                        <span>
                          <a
                            href="https://momentjs.com/"
                            target="_blank"
                            className=" underline mx-1"
                          >
                             moment.js 
                          </a>
                        </span>
                        to manage time-related functionalities
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </a>
      </footer>
    </>
  );
};

export default Footer;
