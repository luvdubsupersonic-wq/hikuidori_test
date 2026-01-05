'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDistance } from '@/utils/distance';

// チェックポイントの設定（本来はDB等から取得）
const CHECKPOINTS = {
  '1': { name: '東京タワー', lat: 35.6586, lng: 139.7454, radius: 50 }, // 半径50m
};

export default function CheckInPage() {
  const searchParams = useSearchParams();
  const pointId = searchParams.get('point');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'out'>('loading');
  const [distance, setDistance] = useState<number | null>(null);
  const target = CHECKPOINTS[pointId as keyof typeof CHECKPOINTS];

  useEffect(() => {
    if (!target) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const d = getDistance(
          pos.coords.latitude,
          pos.coords.longitude,
          target.lat,
          target.lng
        );
        setDistance(Math.round(d));
        setStatus(d <= target.radius ? 'success' : 'out');
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [target]);

  if (!target) return <div>無効なチェックポイントです。</div>;

  return (
    <div className="p-8 text-center">
      <h1 className="text-xl font-bold mb-4">{target.name}</h1>
      
      {status === 'loading' && <p>位置情報を取得中...</p>}

      {status === 'success' && (
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold">
          チェックインする
        </button>
      )}

      {status === 'out' && (
        <div className="text-red-500">
          <p>範囲外にいます。</p>
          <p className="text-2xl font-bold my-2">あと約 {distance} m</p>
          <p className="text-sm">もっと近づいてください。</p>
        </div>
      )}
    </div>
  );
}
