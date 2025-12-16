import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";

interface AvatarSelectionProps {
    selectedAvatar: string;
    onSelect: (avatar: string) => void;
}

const AVATARS = [
    'avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5',
    'avatar-6', 'avatar-7', 'avatar-8', 'avatar-9', 'avatar-10'
];

export default function AvatarSelection({ selectedAvatar, onSelect }: AvatarSelectionProps) {
    return (
        <div className="space-y-2">
            <Label className="text-foreground">اختر صورة الملف الشخصي</Label>
            <ScrollArea className="h-32 w-full rounded-md border border-border p-4 bg-muted/30">
                <div className="flex flex-wrap gap-4 justify-center">
                    {AVATARS.map((avatar) => (
                        <div
                            key={avatar}
                            className={`relative cursor-pointer transition-all duration-200 hover:scale-110 ${selectedAvatar === avatar ? 'scale-110 ring-2 ring-primary rounded-full' : ''}`}
                            onClick={() => onSelect(avatar)}
                        >
                            <Avatar className="w-16 h-16 border-2 border-background">
                                {/* We're assuming avatars are available at /avatars/avatar-X.png. 
                            Since we don't have actual images, we'll rely on fallbacks or generic placeholders if images are missing. 
                            Ideally, the user has these assets or we'd generate them. */}
                                <AvatarImage src={`/avatars/${avatar}.png`} />
                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                    {avatar.split('-')[1]}
                                </AvatarFallback>
                            </Avatar>
                            {selectedAvatar === avatar && (
                                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                                    <Check className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
