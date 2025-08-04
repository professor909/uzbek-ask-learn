import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn } from "lucide-react";
import { useState } from "react";

interface ImageZoomModalProps {
  imageUrl: string;
  alt: string;
  children: React.ReactNode;
}

export const ImageZoomModal = ({ imageUrl, alt, children }: ImageZoomModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative group">
        <div 
          style={{ pointerEvents: 'none' }}
          className="relative"
        >
          {children}
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white hover:bg-black/70"
          onClick={() => setIsOpen(true)}
          style={{ pointerEvents: 'auto' }}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            <img 
              src={imageUrl} 
              alt={alt}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};