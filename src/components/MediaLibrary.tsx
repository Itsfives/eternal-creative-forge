import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Search, 
  Trash2, 
  Download,
  Image as ImageIcon,
  File,
  Video,
  Music
} from "lucide-react";
import { useMedia } from "@/hooks/useMedia";
import { format } from "date-fns";

const MediaLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { media, loading, uploading, uploadFile, deleteFile } = useMedia();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await uploadFile(file);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return ImageIcon;
    if (fileType.startsWith('video/')) return Video;
    if (fileType.startsWith('audio/')) return Music;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = media.filter(item => 
    item.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.file_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleBulkDelete = async () => {
    for (const fileId of selectedFiles) {
      const file = media.find(m => m.id === fileId);
      if (file) {
        try {
          await deleteFile(file.id, file.filename);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    }
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search media..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {selectedFiles.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedFiles.length})
            </Button>
          )}
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-seagram-green hover:bg-seagram-green/90"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{media.length}</div>
            <p className="text-muted-foreground">Total Files</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {formatFileSize(media.reduce((total, file) => total + file.file_size, 0))}
            </div>
            <p className="text-muted-foreground">Total Size</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {media.filter(file => file.file_type.startsWith('image/')).length}
            </div>
            <p className="text-muted-foreground">Images</p>
          </CardContent>
        </Card>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading media...</div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "No files found matching your search." : "No files uploaded yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMedia.map((file) => {
            const FileIcon = getFileIcon(file.file_type);
            const isSelected = selectedFiles.includes(file.id);
            
            return (
              <Card 
                key={file.id} 
                className={`hover:shadow-md transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square mb-3 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    {file.file_type.startsWith('image/') ? (
                      <img 
                        src={file.url} 
                        alt={file.original_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <FileIcon className="w-12 h-12 text-muted-foreground" />
                    )}
                    
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm truncate" title={file.original_name}>
                      {file.original_name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {file.file_type.split('/')[0]}
                      </Badge>
                      <span>{formatFileSize(file.file_size)}</span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(file.created_at), 'MMM d, yyyy')}
                    </p>
                    
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 h-8"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-1 h-8"
                        onClick={() => deleteFile(file.id, file.filename)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;