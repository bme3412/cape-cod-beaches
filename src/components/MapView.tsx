'use client'

import { useEffect, useRef } from 'react'
import type { Map as LeafletMap, CircleMarker as LeafletCircleMarker, Layer } from 'leaflet'
import type { BeachWithData } from '@/types/beach'
import { BEACH_TYPE_LABELS } from '@/lib/utils'

interface Props {
  beaches: BeachWithData[]
}

const MARKER_COLORS: Record<string, string> = {
  ocean_surf: '#0077b6',
  bay_calm: '#0d9488',
  sound: '#0891b2',
  dunes: '#d97706',
  national_seashore: '#16a34a',
  harbor: '#64748b',
}

function buildPopup(beach: BeachWithData): string {
  const photo = beach.photos[0]
  return `
    <div style="width:200px;font-family:system-ui,sans-serif;">
      ${photo ? `<img src="${photo.storage_url}" alt="${beach.name}" style="width:100%;height:110px;object-fit:cover;border-radius:6px;margin-bottom:8px;" />` : ''}
      <div style="font-size:13px;font-weight:600;color:#292524;margin-bottom:2px;">${beach.name}</div>
      <div style="font-size:11px;color:#78716c;margin-bottom:6px;">${beach.town}, MA</div>
      ${beach.rating?.rating ? `<div style="font-size:11px;color:#78716c;">⭐ ${beach.rating.rating.toFixed(1)}</div>` : ''}
      <a href="/beach/${beach.id}" style="display:inline-block;margin-top:8px;font-size:11px;color:#0077b6;text-decoration:none;font-weight:500;">View details →</a>
    </div>
  `
}

export default function MapView({ beaches }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletMap | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const beachesRef = useRef<BeachWithData[]>(beaches)
  beachesRef.current = beaches

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    import('leaflet').then((L) => {
      // Fix webpack asset path issue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: [41.72, -70.4],
        zoom: 10,
        zoomControl: true,
      })
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      beachesRef.current.forEach((beach) => {
        const color = MARKER_COLORS[beach.beach_type] ?? '#0077b6'
        const marker: LeafletCircleMarker = L.circleMarker([beach.lat, beach.lng], {
          radius: 8,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map)
        marker.bindPopup(buildPopup(beach), { maxWidth: 220 })
        marker.on('click', () => marker.openPopup())
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // intentionally init once; markers updated in separate effect

  // Sync markers when filtered beaches change
  useEffect(() => {
    if (!mapInstanceRef.current) return
    import('leaflet').then((L) => {
      const map = mapInstanceRef.current
      if (!map) return

      map.eachLayer((layer: Layer) => {
        if (layer instanceof L.CircleMarker) map.removeLayer(layer)
      })

      beaches.forEach((beach) => {
        const color = MARKER_COLORS[beach.beach_type] ?? '#0077b6'
        const marker: LeafletCircleMarker = L.circleMarker([beach.lat, beach.lng], {
          radius: 8,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map)
        marker.bindPopup(buildPopup(beach), { maxWidth: 220 })
      })
    })
  }, [beaches])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full rounded-2xl overflow-hidden border border-stone-200"
          style={{ height: '560px' }}
        />
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-stone-100 z-[1000]">
          <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-1.5">
            Beach type
          </p>
          <div className="space-y-1">
            {Object.entries(MARKER_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] font-mono text-stone-600">
                  {BEACH_TYPE_LABELS[type as keyof typeof BEACH_TYPE_LABELS] ?? type}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] font-mono text-stone-500 shadow-sm border border-stone-100 z-[1000]">
          {beaches.length} beaches
        </div>
      </div>
    </>
  )
}
