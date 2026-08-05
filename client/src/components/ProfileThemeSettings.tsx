import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTheme, type ThemeVariant } from '@/contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Save, Plus, Copy } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ThemePreset {
  id: number;
  name: string;
  description?: string;
  variant: ThemeVariant;
  intensity: number;
  glowIntensity: number;
  animationSpeed: number;
  accentColor: string;
}

export const ProfileThemeSettings: React.FC = () => {
  const { theme, setTheme, setIntensity, setGlowIntensity, setAnimationSpeed } = useTheme();
  const [presets, setPresets] = useState<ThemePreset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [presetDesc, setPresetDesc] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // tRPC queries and mutations
  const getPreferencesQuery = trpc.theme.getPreferences.useQuery();
  const getPresetsQuery = trpc.theme.getPresets.useQuery();
  const savePreferencesMutation = trpc.theme.savePreferences.useMutation();
  const createPresetMutation = trpc.theme.createPreset.useMutation();
  const deletePresetMutation = trpc.theme.deletePreset.useMutation();

  // Load saved preferences on mount
  useEffect(() => {
    if (getPreferencesQuery.data) {
      setTheme(getPreferencesQuery.data.variant as ThemeVariant);
      setIntensity(getPreferencesQuery.data.intensity);
      setGlowIntensity(getPreferencesQuery.data.glowIntensity);
      setAnimationSpeed(getPreferencesQuery.data.animationSpeed / 100);
    }
  }, [getPreferencesQuery.data]);

  // Load presets
  useEffect(() => {
    if (getPresetsQuery.data) {
      setPresets(getPresetsQuery.data as ThemePreset[]);
    }
  }, [getPresetsQuery.data]);

  const handleSaveCurrentTheme = async () => {
    setLoading(true);
    try {
      await savePreferencesMutation.mutateAsync({
        variant: theme.variant,
        intensity: theme.intensity,
        glowIntensity: theme.glowIntensity,
        animationSpeed: Math.round(theme.animationSpeed * 100),
        accentColor: theme.accentColor,
        presetName: presetName || undefined,
      });
      // Invalidate queries to refresh
      await getPreferencesQuery.refetch();
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePreset = async () => {
    if (!presetName.trim()) return;

    setLoading(true);
    try {
      await createPresetMutation.mutateAsync({
        name: presetName,
        description: presetDesc || undefined,
        variant: theme.variant,
        intensity: theme.intensity,
        glowIntensity: theme.glowIntensity,
        animationSpeed: Math.round(theme.animationSpeed * 100),
        accentColor: theme.accentColor,
      });
      setPresetName('');
      setPresetDesc('');
      setShowSaveForm(false);
      await getPresetsQuery.refetch();
    } catch (error) {
      console.error('Failed to create preset:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePreset = async (presetId: number) => {
    try {
      await deletePresetMutation.mutateAsync(presetId);
      await getPresetsQuery.refetch();
    } catch (error) {
      console.error('Failed to delete preset:', error);
    }
  };

  const handleLoadPreset = (preset: ThemePreset) => {
    setTheme(preset.variant);
    setIntensity(preset.intensity);
    setGlowIntensity(preset.glowIntensity);
    setAnimationSpeed(preset.animationSpeed / 100);
  };

  return (
    <div className="space-y-6">
      {/* Current Theme Display */}
      <Card className="p-6 bg-deep-blue border-neon-cyan/50">
        <h3 className="text-lg font-semibold text-neon-cyan mb-4">Current Theme Settings</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-neon-pink/10 border border-neon-pink/30">
            <p className="text-xs text-muted-foreground">Variant</p>
            <p className="font-semibold text-neon-pink capitalize">{theme.variant.replace('-', ' ')}</p>
          </div>
          <div className="p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30">
            <p className="text-xs text-muted-foreground">Intensity</p>
            <p className="font-semibold text-neon-cyan">{theme.intensity}%</p>
          </div>
          <div className="p-3 rounded-lg bg-neon-green/10 border border-neon-green/30">
            <p className="text-xs text-muted-foreground">Glow</p>
            <p className="font-semibold text-neon-green">{theme.glowIntensity}%</p>
          </div>
          <div className="p-3 rounded-lg bg-neon-yellow/10 border border-neon-yellow/30">
            <p className="text-xs text-muted-foreground">Speed</p>
            <p className="font-semibold text-neon-yellow">{theme.animationSpeed.toFixed(1)}x</p>
          </div>
        </div>

        <Button
          onClick={handleSaveCurrentTheme}
          disabled={loading}
          className="w-full cyberpunk-button"
        >
          <Save className="w-4 h-4 mr-2" />
          Save to Profile
        </Button>
      </Card>

      {/* Save as Preset Form */}
      <AnimatePresence>
        {showSaveForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6 bg-deep-blue border-neon-cyan/50 space-y-4">
              <h3 className="text-lg font-semibold text-neon-cyan">Save as Preset</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neon-cyan">Preset Name</label>
                <Input
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="e.g., My Dark Cyberpunk"
                  className="bg-deep-blue border-neon-cyan/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neon-cyan">Description (Optional)</label>
                <Input
                  value={presetDesc}
                  onChange={(e) => setPresetDesc(e.target.value)}
                  placeholder="e.g., High intensity with fast animations"
                  className="bg-deep-blue border-neon-cyan/30"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreatePreset}
                  disabled={!presetName.trim() || loading}
                  className="flex-1 cyberpunk-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Preset
                </Button>
                <Button
                  onClick={() => setShowSaveForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Presets */}
      {presets.length > 0 && (
        <Card className="p-6 bg-deep-blue border-neon-cyan/50">
          <h3 className="text-lg font-semibold text-neon-cyan mb-4">Saved Presets ({presets.length})</h3>
          
          <div className="space-y-3">
            {presets.map((preset) => (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-lg bg-neon-pink/5 border border-neon-pink/30 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-neon-pink">{preset.name}</p>
                  {preset.description && (
                    <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                  )}
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className="px-2 py-1 rounded bg-neon-cyan/20 text-neon-cyan capitalize">
                      {preset.variant.replace('-', ' ')}
                    </span>
                    <span className="px-2 py-1 rounded bg-neon-green/20 text-neon-green">
                      {preset.intensity}% intensity
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleLoadPreset(preset)}
                    size="sm"
                    className="cyberpunk-button"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeletePreset(preset.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Save Preset Button */}
      {!showSaveForm && (
        <Button
          onClick={() => setShowSaveForm(true)}
          className="w-full cyberpunk-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Save Current as Preset
        </Button>
      )}
    </div>
  );
};
