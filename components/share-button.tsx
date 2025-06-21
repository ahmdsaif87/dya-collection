import { Check, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ShareButton() {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    toast.success("Link berhasil disalin");
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={handleCopy}
          size="icon"
          disabled={isCopied}
        >
          {isCopied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Share2 className="w-4 h-4 text-primary" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Bagikan produk ini</p>
      </TooltipContent>
    </Tooltip>
  );
}
