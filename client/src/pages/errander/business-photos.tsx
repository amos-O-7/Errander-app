import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Camera, Trash2, Clock, CheckCircle, XCircle, Plus, Info } from "lucide-react";
import { Link } from "wouter";
import { useState, useRef } from "react";

export default function BusinessPhotos() {
  // Mock initial photos
  const [photos, setPhotos] = useState([
    { id: 1, url: "https://images.unsplash.com/photo-1581578731117-104f2a417953?w=500&auto=format&fit=crop&q=60", status: "approved" },
    { id: 2, url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60", status: "pending" }
  ]);
  
  const [isDirty, setIsDirty] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && photos.length < 4) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos([
          ...photos, 
          { 
            id: Date.now(), 
            url: reader.result as string, 
            status: "pending" 
          }
        ]);
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = (id: number) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      setPhotos(photos.filter(p => p.id !== id));
      setIsDirty(true);
    }
  };

  const handleSave = () => {
    setIsDirty(false);
    // In a real app, this would submit the photos
    alert("Photos submitted for vetting. They will be visible to customers once approved.");
  };

  const triggerUpload = () => {
    if (photos.length < 4) {
      fileInputRef.current?.click();
    }
  };

  return (
    <MobileLayout hideNav>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white p-4 sticky top-0 z-10 border-b shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/errander/home">
              <button className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center -ml-2">
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
            </Link>
            <h1 className="font-bold text-xl">Business Photos</h1>
          </div>
          {isDirty && (
            <Button size="sm" onClick={handleSave} className="animate-in fade-in">
              Save
            </Button>
          )}
        </div>

        <div className="flex-1 p-4 space-y-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
            <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">Photo Guidelines</p>
              <p>Showcase your work! Upload up to 4 photos. All photos are reviewed to ensure they don't contain contact details.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group bg-white border border-gray-200 shadow-sm">
                <img src={photo.url} alt="Business" className="w-full h-full object-cover" />
                
                {/* Status Badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase backdrop-blur-md flex items-center gap-1
                  ${photo.status === 'approved' ? 'bg-green-500/90 text-white' : 'bg-yellow-500/90 text-white'}`}>
                  {photo.status === 'approved' ? (
                    <><CheckCircle size={10} /> Approved</>
                  ) : (
                    <><Clock size={10} /> Pending</>
                  )}
                </div>

                {/* Delete Action */}
                <button 
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-2 right-2 h-8 w-8 bg-red-500/90 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {photos.length < 4 && (
              <div 
                onClick={triggerUpload}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 cursor-pointer hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-1 group-hover:bg-primary/10 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="text-xs font-bold">Add Photo</span>
                <span className="text-[10px]">{photos.length}/4</span>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAddPhoto} 
            className="hidden" 
            accept="image/*"
          />
        </div>
      </div>
    </MobileLayout>
  );
}
