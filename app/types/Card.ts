import type { HTMLAttributes } from "vue";

/**
 * ธีมสีหลักของการ์ดที่อ้างอิงจาก Design System ใน globals.css
 */
export type CardVariant =
  | "default"
  | "primary"
  | "blue"
  | "yellow"
  | "gold"
  | "outline";

export type CardSize = "sm" | "default" | "lg" | "full" | "auto";

export type CardFont = "primary" | "secondary";

export interface CardProps extends /* @vue-ignore */ HTMLAttributes {
  /** รูปแบบธีมสีของการ์ด */
  variant?: CardVariant;
  /** ขนาดและการจัด Padding */
  size?: CardSize;
  /** ฟอนต์หลักของการ์ด (primary = Bai Jamjuree, secondary = Anuphan) */
  fontFamily?: CardFont;
  className?: string;
}

export interface StatCardProps extends CardProps {
  /** คลาสสำหรับตกแต่งไอคอนเฉพาะจุด */
  iconClassName?: string;
  /** ข้อความหัวข้อ เช่น "จำนวนนักกีฬา", "ประเภทกีฬา" */
  title?: string;
  /** คลาสสำหรับตกแต่งหัวข้อ */
  titleClassName?: string;
  /** ค่าตัวเลขหรือข้อความหลัก เช่น "24", "10+" */
  value?: string | number;
  /** คลาสสำหรับตกแต่งค่าตัวเลขหลัก */
  valueClassName?: string;
  /** หน่วยนับหรือคำอธิบายด้านล่าง เช่น "คน", "ชนิดกีฬา" */
  unit?: string;
  /** คลาสสำหรับตกแต่งหน่วยนับ */
  unitClassName?: string;
}
