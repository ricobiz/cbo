
import { ContentGenerator } from "@/components/ContentGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Image, Music, Video, Calendar } from "lucide-react";

const ContentPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Generator</h1>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Text</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span>Image</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Audio</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Video</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ContentGenerator />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                      <div className="text-sm font-medium">YouTube video title</div>
                      <div className="text-xs text-muted-foreground mt-1">Generated 2 hours ago</div>
                    </div>
                    <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                      <div className="text-sm font-medium">Twitter thread on AI marketing</div>
                      <div className="text-xs text-muted-foreground mt-1">Generated yesterday</div>
                    </div>
                    <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                      <div className="text-sm font-medium">Instagram captions for product launch</div>
                      <div className="text-xs text-muted-foreground mt-1">Generated 3 days ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="image">
          <Card>
            <CardHeader>
              <CardTitle>Image Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Coming soon! Image generation capabilities will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle>Audio Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Coming soon! Audio generation capabilities will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>Video Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Coming soon! Video generation capabilities will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Content Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Coming soon! Content scheduling capabilities will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentPage;
