"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSpotify } from "@/components/spotify-provider";
import { Button } from "@/components/ui/button";
import { Download, Share2, Loader2 } from "lucide-react";
import { TopTracksResponse, TopArtistsResponse, SpotifyTrack, SpotifyArtist } from "@/types/spotify";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  contentType: z.enum(["tracks", "artists"]),
  timeRange: z.enum(["short_term", "medium_term", "long_term"]),
  showImages: z.boolean(),
  grayscaleImages: z.boolean(),
  itemCount: z.number().min(5).max(10),
  backgroundColor: z.enum(["black", "white"]),
});

type FormValues = z.infer<typeof formSchema>;

export function ReceiptView() {
  const { client } = useSpotify();
  const { data: session } = useSession();
  const [topItems, setTopItems] = useState<SpotifyTrack[] | SpotifyArtist[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasDataUrl, setCanvasDataUrl] = useState<string | null>(null);
  const [canvasDisplayHeight, setCanvasDisplayHeight] = useState(672); // Default display height

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentType: "tracks",
      timeRange: "short_term",
      showImages: true,
      grayscaleImages: true,
      itemCount: 5,
      backgroundColor: "white",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!client) {
      alert("Spotify client is not available. Please try logging in again.");
      return;
    }

    setIsLoading(true);
    setIsGenerating(true);
    setShowReceipt(false);
    setTopItems(null);

    try {
      if (values.contentType === "tracks") {
        const data = await client.getTopTracks({
          time_range: values.timeRange,
          limit: values.itemCount,
        }) as TopTracksResponse;
        setTopItems(data.items);
      } else {
        const data = await client.getTopArtists({
          time_range: values.timeRange,
          limit: values.itemCount,
        }) as TopArtistsResponse;
        setTopItems(data.items);
      }
      setShowReceipt(true);
    } catch (err) {
      console.error("Failed to fetch top items:", err);
      alert("Failed to fetch data from Spotify. Please try again.");
      setIsGenerating(false);
      setShowReceipt(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to draw on the canvas once topItems is set and canvas is in the DOM
  useEffect(() => {
    if (!topItems || !showReceipt) return;

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found in DOM");
      alert("Failed to render receipt: Canvas element not found. Please try again.");
      setIsGenerating(false);
      setShowReceipt(false);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context not found");
      setIsGenerating(false);
      setShowReceipt(false);
      return;
    }

    // Calculate canvas height based on number of items
    const headerHeight = 340; // Space for header (title, subtitle, date, dashed line)
    const trackHeight = 300; // Height per item
    const padding = 100; // Top and bottom padding
    const numItems = topItems.length;
    const canvasWidth = 1080;
    const canvasHeight = headerHeight + (numItems * trackHeight) + padding;

    // Set canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Calculate display height (scaled proportionally to maintain aspect ratio)
    const displayWidth = 378; // Fixed display width
    const aspectRatio = canvasHeight / canvasWidth;
    const newDisplayHeight = displayWidth * aspectRatio;
    setCanvasDisplayHeight(newDisplayHeight);

    // Colors based on background selection
    const { backgroundColor } = form.getValues();
    const bgColor = backgroundColor === "black" ? "#1a1a1a" : "#faf6e9";
    const textColor = backgroundColor === "black" ? "#faf6e9" : "#1a1a1a";
    const subTextColor = backgroundColor === "black" ? "#cccccc" : "#666";
    const borderColor = backgroundColor === "black" ? "#cccccc" : "#4a4a4a";

    // Background with textured paper effect
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Add subtle noise for texture
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      ctx.fillStyle = `rgba(${backgroundColor === "black" ? 255 : 0}, ${backgroundColor === "black" ? 255 : 0}, ${backgroundColor === "black" ? 255 : 0}, ${Math.random() * 0.05})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Decorative dashed border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 10;
    ctx.setLineDash([20, 20]);
    ctx.strokeRect(30, 30, canvasWidth - 60, canvasHeight - 60);
    ctx.setLineDash([]);

    // Header
    ctx.font = "bold 80px 'Courier New', monospace";
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.fillText("Spotify Receipt", canvasWidth / 2, 150);

    ctx.font = "48px 'Courier New', monospace";
    ctx.fillStyle = subTextColor;
    const userName = session?.user?.name || "User";
    const contentType = form.getValues().contentType;
    const headerText = `${userName}'s Top ${contentType === "tracks" ? "Tracks" : "Artists"}`;
    ctx.fillText(headerText, canvasWidth / 2, 220);

    ctx.font = "40px 'Courier New', monospace";
    ctx.fillStyle = subTextColor;
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    ctx.fillText(formattedDate, canvasWidth / 2, 280);

    // Dashed line
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(100, 340);
    ctx.lineTo(canvasWidth - 100, 340);
    ctx.strokeStyle = subTextColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.setLineDash([]);

    // Tracks or Artists
    const loadImage = (src: string): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = src;

        const timeout = setTimeout(() => {
          console.warn(`Image load timeout: ${src}`);
          resolve(null);
        }, 5000);

        img.onload = () => {
          clearTimeout(timeout);
          resolve(img);
        };
        img.onerror = () => {
          clearTimeout(timeout);
          console.warn(`Failed to load image: ${src}`);
          resolve(null);
        };
      });
    };

    const truncateText = (text: string, maxWidth: number, font: string): string => {
      ctx.font = font;
      let width = ctx.measureText(text).width;
      if (width <= maxWidth) return text;

      let truncated = text;
      while (width > maxWidth - ctx.measureText("...").width && truncated.length > 0) {
        truncated = truncated.slice(0, -1);
        width = ctx.measureText(truncated).width;
      }
      return truncated + "...";
    };

    const drawItems = async () => {
      try {
        console.log("Starting to draw items...");
        let y = 420;
        const { showImages, grayscaleImages } = form.getValues();

        const imagePromises = topItems.map((item) => {
          const images = "album" in item ? item.album.images : item.images;
          if (showImages && images?.length > 0) {
            console.log(`Loading image for item ${item.name}: ${images[0].url}`);
            return loadImage(images[0].url);
          }
          return Promise.resolve(null);
        });

        const loadedImages = await Promise.all(imagePromises);
        console.log("All images loaded or failed:", loadedImages);

        for (let i = 0; i < topItems.length; i++) {
          console.log(`Drawing item ${i + 1}/${topItems.length}: ${topItems[i].name}`);
          const item = topItems[i];
          const name = "name" in item ? item.name : "";
          const artists = "artists" in item ? item.artists : [];
          const img = loadedImages[i];

          // Item number
          ctx.font = "56px 'Courier New', monospace";
          ctx.fillStyle = textColor;
          ctx.textAlign = "left";
          ctx.fillText(`${i + 1}.`, 100, y + 50);

          // Determine the starting x position for text based on whether images are shown
          const textStartX = showImages ? 420 : 180; // Shift text left if no images
          const maxTextWidth = canvasWidth - textStartX - 100; // Adjust max width for truncation

          // Album or Artist image (if enabled)
          if (showImages) {
            if (img) {
              console.log(`Drawing image for item ${item.name}`);
              ctx.save();
              if (grayscaleImages) {
                ctx.filter = "grayscale(100%)";
              }
              ctx.drawImage(img, 180, y - 30, 180, 180);
              ctx.restore();
            } else {
              console.log(`No image available for item ${item.name}`);
            }
          }

          // Item name
          ctx.font = "50px 'Courier New', monospace";
          ctx.fillStyle = textColor;
          ctx.textAlign = "left";
          const itemName = truncateText(name, maxTextWidth, "50px 'Courier New', monospace");
          ctx.fillText(itemName, textStartX, y + 50);

          // Artist name (only for tracks)
          if ("artists" in item && artists.length > 0) {
            ctx.font = "44px 'Courier New', monospace";
            ctx.fillStyle = subTextColor;
            const artistName = truncateText(artists[0].name, maxTextWidth, "44px 'Courier New', monospace");
            ctx.fillText(artistName, textStartX, y + 120);
          }

          y += trackHeight;
        }

        console.log("Finished drawing items");
        setCanvasDataUrl(canvas.toDataURL("image/png"));
      } catch (err) {
        console.error("Error drawing items:", err);
        alert("Failed to generate receipt. Please try again.");
        setShowReceipt(false);
      } finally {
        console.log("Setting isGenerating to false");
        setIsGenerating(false);
      }
    };

    console.log("Calling drawItems...");
    drawItems();
  }, [topItems, showReceipt]);

  const handleDownload = () => {
    if (!canvasDataUrl) return;

    const link = document.createElement("a");
    link.download = "spotify-receipt.png";
    link.href = canvasDataUrl;
    link.click();
  };

  const handleShare = async () => {
    if (!canvasDataUrl) return;

    try {
      const response = await fetch(canvasDataUrl);
      const blob = await response.blob();
      const file = new File([blob], "spotify-receipt.png", { type: "image/png" });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "My Spotify Receipt",
          text: "Check out my Spotify Receipt!",
        });
      } else {
        alert("Sharing is not supported on this device. You can download the image instead.");
      }
    } catch (err) {
      console.error("Failed to share:", err);
      alert("Failed to share the receipt. You can download it instead.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {!showReceipt ? (
        <>
          <h1 className="text-3xl font-bold text-white mb-6">Customize Your Receipt</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Content Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/10 text-white border-white/20">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tracks">Top Tracks</SelectItem>
                        <SelectItem value="artists">Top Artists</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Time Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/10 text-white border-white/20">
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="short_term">Short Term (4 weeks)</SelectItem>
                        <SelectItem value="medium_term">Medium Term (6 months)</SelectItem>
                        <SelectItem value="long_term">Long Term (All time)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showImages"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="text-white">
                      {form.getValues().contentType === "tracks" ? "Show Album Images" : "Show Artist Images"}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grayscaleImages"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="text-white">Grayscale Images</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-green-500"
                        disabled={!form.getValues().showImages}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="itemCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Number of Items ({field.value})</FormLabel>
                    <FormControl>
                      <Slider
                        min={5}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Background Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/10 text-white border-white/20">
                          <SelectValue placeholder="Select background color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={isLoading || isGenerating}
              >
                {isLoading || isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Print Receipt"
                )}
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6 w-[378px]">
            <h1 className="text-3xl font-bold text-white">Your Receipt</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDownload}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <div style={{ position: "relative", width: "378px", height: `${canvasDisplayHeight}px` }}>
              <div
                style={{
                  display: isGenerating ? "flex" : "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#faf6e9",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Loader2 className="h-8 w-8 animate-spin text-gray-600 mb-4" />
                <p className="text-xl text-gray-600">Generating Receipt...</p>
              </div>
              <canvas
                ref={canvasRef}
                style={{
                  width: "378px",
                  height: `${canvasDisplayHeight}px`,
                  transform: "scale(1)",
                  transformOrigin: "center",
                  display: isGenerating ? "none" : "block",
                }}
              />
            </div>
          </div>
          <Button
            onClick={() => {
              setShowReceipt(false);
              setCanvasDataUrl(null);
            }}
            variant="outline"
            className="mt-4 text-white"
          >
            Back to Customize
          </Button>
        </>
      )}
    </div>
  );
}