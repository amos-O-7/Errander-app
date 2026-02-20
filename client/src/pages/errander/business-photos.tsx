import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2, CheckCircle, Plus, Info, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useRef } from "react";
import { useApiQuery, useApiMutation } from "@/lib/use-api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiUpload } from "@/lib/api";
import { useUser } from "@/lib/user-context";

export default function BusinessPhotos() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();

  const { data: photos = [], isLoading } = useApiQuery<any[]>(
    ["business-photos"],
    "/sp/business-photos"
  );

  const deleteMutation = useApiMutation<any, number>(
    (id: number) => `/sp/business-photos/${id}`,
    {
      method: "DELETE",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["business-photos"] });
        toast({ description: "Photo deleted." });
      },
      onError: (err: Error) => {
        toast({ title: "Failed", description: err.message, variant: "destructive" });
      }
    }
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photos.length >= 3) {
      toast({ title: "Limit Reached", description: "You can only upload 3 business photos.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await apiUpload("/sp/business-photos", formData);
      queryClient.invalidateQueries({ queryKey: ["business-photos"] });
      toast({ description: "Photo uploaded successfully." });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    }

    // Reset so same file can be re-selected
    e.target.value = "";
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this photo?")) {
      deleteMutation.mutate(id);
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
            <div>
              <h1 className="font-bold text-xl">Business Photos</h1>
              <p className="text-xs text-gray-400">{photos.length}/3 photos</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
            <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">Photo Guidelines</p>
              <p>Upload up to 3 photos showcasing your work. No contact details allowed. Photos are reviewed before publishing.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo: any) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-xl overflow-hidden group bg-white border border-gray-200 shadow-sm"
                >
                  <img src={photo.url} alt="Business" className="w-full h-full object-cover" />

                  {/* Status badge */}
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase backdrop-blur-md flex items-center gap-1 bg-green-500/90 text-white">
                    <CheckCircle size={10} /> Approved
                  </div>

                  {/* Caption */}
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] px-2 py-1 truncate">
                      {photo.caption}
                    </div>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(photo.id)}
                    disabled={deleteMutation.isPending}
                    className="absolute top-2 right-2 h-8 w-8 bg-red-500/90 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity"
                  >
                    {deleteMutation.isPending
                      ? <Loader2 size={12} className="animate-spin" />
                      : <Trash2 size={14} />}
                  </button>
                </div>
              ))}

              {/* Add Photo button */}
              {photos.length < 3 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 cursor-pointer hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <span className="text-xs font-bold">Add Photo</span>
                  <span className="text-[10px]">{photos.length}/3</span>
                </div>
              )}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>
    </MobileLayout>
  );
}
