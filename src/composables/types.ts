import type { Feature, Point } from '@turf/turf'

export interface PointFeatureProp {
  // 自动生成
  id: string
  // 切片点描述
  name: string
  // 切片点日期
  date: string
  // 切片点时间（大致）
  time: string
  // 自动生成
  icon: string
  // 视频ID
  vid: string
  // 视频名称
  vName: string
  // 视频切片秒数
  vt: number
  // 视频发布时间
  vDate: string
}

export interface RawItemData {
  // 切片点描述
  name: string
  // 切片点日期
  date: string
  // 切片点时间（大致）
  time: string
  type: 'bicycle' | 'campsite'
  // 切片点坐标（大致）
  coordinates: [number, number]
  // 切片点时间（大致）
  vTime: number
}

export interface RawData {
  // 视频ID
  vid: string
  // 视频发布时间
  vDate: string
  // 视频名称
  vName: string
  // 视频路程km
  vDistanceKm: number
  vClips: RawItemData[]
}

export interface RouteItem {
  label: string
  value: string
  dateRange: number[]
  url: string
}

export type PointFeature = Feature<Point, PointFeatureProp>
