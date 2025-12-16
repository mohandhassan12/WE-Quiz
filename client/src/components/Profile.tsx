import { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, TrendingUp, LogOut, Camera, Loader2 } from "lucide-react";
import type { PlayerData } from "@/hooks/useQuizGame";
import { supabase } from "@/lib/supabase";

interface ProfileProps {
    playerData: PlayerData;
    onBack: () => void;
    onLogout: () => void;
    onUpdateProfile?: (data: PlayerData) => void;
}

export default function Profile({ playerData, onBack, onLogout, onUpdateProfile }: ProfileProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const avatarUrl = playerData.avatar_url || 'avatar-1';

    // Check if avatarUrl is a full URL (uploaded) or a local ID (default)
    const displayAvatarUrl = avatarUrl.startsWith('http')
        ? avatarUrl
        : `/avatars/${avatarUrl}.png`;

    // Calculate level progress
    const currentLevelScore = playerData.total_score - (playerData.current_level - 1) * 100;

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !playerData.id) return;

        setIsUploading(true);
        try {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${playerData.id}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // 3. Update Player Profile
            const { error: updateError } = await supabase
                .from('players')
                .update({ avatar_url: publicUrl })
                .eq('id', playerData.id);

            if (updateError) throw updateError;

            // 4. Update Local State
            if (onUpdateProfile) {
                onUpdateProfile({
                    ...playerData,
                    avatar_url: publicUrl
                });
            }

        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

            <div className="w-full max-w-2xl animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-8">
                    الملف الشخصي
                </h1>

                <Card className="bg-card border-2 border-primary/30 shadow-xl backdrop-blur-sm mb-6">
                    <CardHeader className="flex flex-col items-center pt-8 pb-2">
                        <div className="relative mb-4 group cursor-pointer" onClick={handleFileSelect}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarUpload}
                                accept="image/*"
                                className="hidden"
                            />

                            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>

                            <div className="relative">
                                <Avatar className="w-32 h-32 border-4 border-background relative z-10">
                                    <AvatarImage src={displayAvatarUrl} alt="Profile" className="object-cover" />
                                    <AvatarFallback className="text-4xl font-display font-bold bg-muted text-foreground">
                                        {playerData.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Overlay for upload indication */}
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                    {isUploading ? (
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    ) : (
                                        <Camera className="w-8 h-8 text-white" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-display font-bold text-foreground">
                            {playerData.username}
                        </h2>
                        <p className="text-muted-foreground font-body">
                            {playerData.branch || 'بدون فرع'}
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-8 p-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-background/50 p-4 rounded-xl border border-primary/20 flex flex-col items-center text-center">
                                <Trophy className="w-8 h-8 text-accent mb-2" />
                                <span className="text-sm text-muted-foreground font-body">المستوى الحالي</span>
                                <span className="text-2xl font-display font-bold text-foreground">{playerData.current_level}</span>
                            </div>

                            <div className="bg-background/50 p-4 rounded-xl border border-primary/20 flex flex-col items-center text-center">
                                <Star className="w-8 h-8 text-primary mb-2" />
                                <span className="text-sm text-muted-foreground font-body">إجمالي النقاط</span>
                                <span className="text-2xl font-display font-bold text-foreground">{playerData.total_score}</span>
                            </div>

                            <div className="bg-background/50 p-4 rounded-xl border border-primary/20 flex flex-col items-center text-center">
                                <TrendingUp className="w-8 h-8 text-secondary mb-2" />
                                <span className="text-sm text-muted-foreground font-body">الترتيب</span>
                                <span className="text-2xl font-display font-bold text-foreground">--</span>
                            </div>
                        </div>

                        {/* Level Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-foreground">تقدم المستوى {playerData.current_level}</span>
                                <span className="text-xs text-muted-foreground">{currentLevelScore} / 100 نقطة</span>
                            </div>
                            <Progress value={currentLevelScore} className="h-4 bg-muted" indicatorClassName="bg-gradient-to-r from-primary to-accent" />
                            <p className="text-xs text-center text-muted-foreground mt-2">
                                {100 - currentLevelScore} نقطة متبقية للوصول للمستوى التالي
                            </p>
                        </div>

                        {/* Player Info */}
                        <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-right">
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="font-bold text-foreground">{playerData.email}</span>
                                <span className="text-muted-foreground">البريد الإلكتروني</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="font-bold text-foreground">{new Date(playerData.last_played_at).toLocaleDateString('ar-EG')}</span>
                                <span className="text-muted-foreground">آخر ظهور</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <Button
                                onClick={onBack}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold py-6 text-lg"
                            >
                                العودة للعبة
                            </Button>
                            <Button
                                onClick={onLogout}
                                variant="outline"
                                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 font-display font-bold py-6 text-lg flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-5 h-5" />
                                تسجيل الخروج
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
