
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Copy, Check } from "lucide-react";

export function ContentGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [style, setStyle] = useState("informative");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to generate content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Mock content generation delay
    setTimeout(() => {
      const platformContent = {
        twitter: {
          informative: `📊 Did you know? AI automation can increase marketing efficiency by up to 80%! #AIMarketing #DigitalEfficiency`,
          engaging: `🤯 My mind was BLOWN when I saw the results of using AI for marketing automation! 80% efficiency boost in just ONE week! Has anyone else tried this? #AIRevolution`,
          promotional: `Ready to 10x your marketing results? Our AI platform delivers 80% more efficiency with half the effort. Limited time offer: Start your free trial now! #AIMarketing #GrowthHacking`
        },
        instagram: {
          informative: `AI-driven marketing isn't just a trend—it's the future. Our latest case study shows how brands are seeing 80% increases in efficiency.\n\n#AIMarketing #DigitalTransformation #MarketingTips`,
          engaging: `✨ Question for my marketing fam! ✨\n\nHave you implemented AI in your strategy yet? We're seeing CRAZY results (80% efficiency increase!) with our new approach.\n\nDrop a 🤖 if you want me to share more insights!\n\n#MarketingTips #AIRevolution`,
          promotional: `Transform your digital presence with AI-powered marketing\n\n✅ 80% increase in efficiency\n✅ Personalized content at scale\n✅ Data-driven strategies\n\nClick the link in bio to start your journey!\n\n#MarketingTransformation #AITechnology`
        },
        youtube: {
          informative: `The Evolution of AI in Digital Marketing: Data-Driven Strategies for 2024\n\nIn this comprehensive analysis, we explore how artificial intelligence is reshaping the marketing landscape, with case studies showing efficiency improvements of up to 80% across various industries.`,
          engaging: `I Tried AI Marketing for 30 Days... The Results Will SHOCK You! 😱\n\nIn this video, I document my journey using cutting-edge AI tools for my marketing strategy. From content creation to audience targeting, see how I achieved an 80% boost in efficiency and the lessons I learned along the way.`,
          promotional: `REVEALED: The AI Marketing Secret Big Agencies Don't Want You To Know\n\nDiscover how our proprietary AI system is helping businesses just like yours achieve 80% more marketing efficiency while cutting costs in half. Limited spots available for our exclusive beta program!`
        }
      };
      
      setGeneratedContent(platformContent[platform as keyof typeof platformContent][style as keyof typeof platformContent.twitter]);
      setIsGenerating(false);
      
      toast({
        title: "Content generated",
        description: "Your content has been generated successfully.",
      });
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast({
      title: "Content copied",
      description: "Content has been copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Topic</label>
          <Input 
            placeholder="Enter a topic or keyword" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Style</label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informative">Informative</SelectItem>
                <SelectItem value="engaging">Engaging</SelectItem>
                <SelectItem value="promotional">Promotional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleGenerate} 
          disabled={isGenerating || !topic}
        >
          {isGenerating ? "Generating..." : "Generate Content"}
        </Button>
        
        {generatedContent && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Generated Content</label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Textarea 
              value={generatedContent} 
              readOnly 
              className="min-h-[120px] font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
