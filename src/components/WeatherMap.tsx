'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { addHours, format } from 'date-fns';
import { Cloud, CloudRain, Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Map from './Map';

const WeatherMap = () => {
  const [timeOffset, setTimeOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'clouds' | 'precipitation'>(
    'precipitation'
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setTimeOffset((prev) => {
          if (prev >= 24) {
            setIsPlaying(false);
            return 24;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTimeChange = (value: number[]) => {
    setTimeOffset(value[0]);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (timeOffset >= 24) {
      setTimeOffset(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className='h-screen w-full relative bg-background'>
      <Map timeOffset={timeOffset} activeLayer={activeLayer} />

      <Card className='fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl shadow-lg z-[9999]'>
        <CardContent className='p-4'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='icon' onClick={handlePlayPause}>
                {isPlaying ? (
                  <Pause className='h-4 w-4' />
                ) : (
                  <Play className='h-4 w-4' />
                )}
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setTimeOffset(0)}
              >
                <RotateCcw className='h-4 w-4' />
              </Button>
              <span className='text-sm font-medium'>
                {format(addHours(new Date(), timeOffset), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
            <div className='w-full md:w-1/2'>
              <Slider
                min={0}
                max={24}
                step={1}
                value={[timeOffset]}
                onValueChange={handleTimeChange}
                className='w-full'
              />
            </div>
            <ToggleGroup
              type='single'
              value={activeLayer}
              onValueChange={(value) =>
                setActiveLayer(value as 'clouds' | 'precipitation')
              }
            >
              <ToggleGroupItem value='clouds' aria-label='Toggle clouds'>
                <Cloud className='h-4 w-4' />
              </ToggleGroupItem>
              <ToggleGroupItem
                value='precipitation'
                aria-label='Toggle precipitation'
              >
                <CloudRain className='h-4 w-4' />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherMap;