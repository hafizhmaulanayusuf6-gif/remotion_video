import React from "react";
import { COLORS, COMPOSITION_CONFIG, SCENE1_LAYOUT } from "../config";
import { Room } from "./Room";
import { Laptop } from "./Laptop";
import { Clock } from "./Clock";
import { CoffeeCup } from "./CoffeeCup";

export interface CoffeeCupState {
  x: number;
  y?: number;
  opacity?: number;
}

export interface DeskSettingProps {
  cameraScale: number;
  clockText?: string;
  cups?: CoffeeCupState[];
  stickMan?: React.ReactNode;
  panelContent?: React.ReactNode;
  children?: React.ReactNode;
}

export const DeskSetting: React.FC<DeskSettingProps> = ({
  cameraScale,
  clockText = "02:00",
  cups = [
    {
      x: SCENE1_LAYOUT.coffeeCup.x,
      y: SCENE1_LAYOUT.coffeeCup.bottomY,
      opacity: 1,
    },
  ],
  stickMan,
  panelContent,
  children,
}) => {
  const { camera, laptop, screenInset, connectorLines } = SCENE1_LAYOUT;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: COMPOSITION_CONFIG.width,
        height: COMPOSITION_CONFIG.height,
        transformOrigin: `${camera.originX}px ${camera.originY}px`,
        transform: `scale(${cameraScale})`,
      }}
    >
      {/* Wall Clock */}
      <Clock text={clockText} />

      {/* Zoom connector lines (behind stick man, coffee cup, desk) */}
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <line
          x1={laptop.screenTopX}
          y1={laptop.screenTopY}
          x2={screenInset.x}
          y2={screenInset.y}
          stroke={COLORS.furniture}
          strokeWidth={connectorLines.strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1={laptop.hingeX}
          y1={laptop.hingeY}
          x2={screenInset.x}
          y2={screenInset.y + screenInset.height}
          stroke={COLORS.furniture}
          strokeWidth={connectorLines.strokeWidth}
          strokeLinecap="round"
        />
      </svg>

      {/* Room: Floor, Chair, Desk */}
      <Room />

      {/* Stick Man sitting at desk */}
      {stickMan}

      {/* Laptop (side view, no screen content) */}
      <Laptop />

      {/* Coffee Cups on Desk */}
      {cups.map((cup, index) => (
        <CoffeeCup
          key={index}
          x={cup.x}
          y={cup.y}
          opacity={cup.opacity}
        />
      ))}

      {/* Screen Inset Panel */}
      <div
        style={{
          position: "absolute",
          left: screenInset.x,
          top: screenInset.y,
          width: screenInset.width,
          height: screenInset.height,
          backgroundColor: COLORS.screen,
          borderRadius: screenInset.cornerRadius,
          overflow: "hidden",
        }}
      >
        {panelContent}
      </div>

      {children}
    </div>
  );
};
