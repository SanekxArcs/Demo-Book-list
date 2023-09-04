import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center gap-2 items-center h-[73svh]"><Loader  className=" animate-spin w-10 h-10"/>
      <h1 className="text-5xl font-extrabold">Loading</h1> 
      <p className=" text-muted-foreground">please wait to server response</p>
    </div>
  );
}

export default Loading
