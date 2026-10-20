import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import type { VFXConfig, AspectRatio, SceneAnchorsConfig } from '../types/video.ts';
import {
  updateRaindrop,
  updateRipple,
  calculateCameraTransform,
  calculateImageCropBounds,
  drawProceduralFallbackScene,
  kelvinToRgb,
  FlashGuard,
} from '../utils/vfxEngine.ts';
import { soundscape } from '../utils/audioSynthesizer.ts';

interface VideoCanvasProps {
  imageSrc: string;
  vfx: VFXConfig;
  anchors: SceneAnchorsConfig;
  aspectRatio: AspectRatio;
  isPlaying: boolean;
  onThunderFlash?: () => void;
}

export interface VideoCanvasRef {
  getCanvas: () => HTMLCanvasElement | null;
  captureStream: (fps?: number) => MediaStream | null;
}

interface RainParticle {
  x: number;
  y: number;
  length: number;
  speed: number;
  layer: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
}

interface FloatingParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  size: number;
  color: string;
  type: 'leaf' | 'sakura' | 'ember' | 'firefly' | 'snow';
  phase?: number;
}

interface CloudPuff {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  speed: number;
  opacity: number;
}

export const VideoCanvas = forwardRef<VideoCanvasRef, VideoCanvasProps>(
  ({ imageSrc, vfx, anchors, aspectRatio, isPlaying, onThunderFlash }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);

    // Animation state
    const animIdRef = useRef<number | null>(null);
    const rainParticlesRef = useRef<RainParticle[]>([]);
    const ripplesRef = useRef<Ripple[]>([]);
    const floatingParticlesRef = useRef<FloatingParticle[]>([]);
    const cloudsRef = useRef<CloudPuff[]>([]);
    const flashOpacityRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const elapsedSecRef = useRef<number>(0);
    const nextThunderTimeRef = useRef<number>(6 + Math.random() * 8);

    // WCAG 2.3.1 Flash Guard instance
    const flashGuardRef = useRef<FlashGuard>(new FlashGuard());

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      captureStream: (fps = 30) => {
        if (!canvasRef.current) return null;
        return canvasRef.current.captureStream(fps);
      },
    }));

    useEffect(() => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        imgRef.current = img;
        setImgLoaded(true);
      };
      return () => {
        img.onload = null;
      };
    }, [imageSrc]);

    // Initialize particles
    const initParticles = useCallback((w: number, h: number) => {
      // Rain particles
      const rainCount = Math.floor((vfx.rainIntensity / 100) * 350) + (vfx.rainIntensity > 0 ? 30 : 0);
      const rain: RainParticle[] = [];
      for (let i = 0; i < rainCount; i++) {
        const layer = Math.random() > 0.6 ? 2 : Math.random() > 0.3 ? 1 : 0;
        rain.push({
          x: Math.random() * w,
          y: Math.random() * h,
          length: layer === 2 ? 22 + Math.random() * 12 : layer === 1 ? 14 + Math.random() * 8 : 8 + Math.random() * 5,
          speed: layer === 2 ? 18 + Math.random() * 8 : layer === 1 ? 12 + Math.random() * 6 : 8 + Math.random() * 4,
          layer,
        });
      }
      rainParticlesRef.current = rain;

      // Floating particles (Leaves, Sakura, Embers, Fireflies, Snow)
      const floaters: FloatingParticle[] = [];

      // Leaves / Sakura
      if (vfx.leavesPetals > 0) {
        const count = Math.floor((vfx.leavesPetals / 100) * 35) + 5;
        const colors =
          vfx.leavesType === 'sakura'
            ? ['#fbcfe8', '#f472b6', '#fda4af', '#fecdd3']
            : ['#2e4928', '#3d6335', '#4d7842', '#22381f', '#5e8548'];
        for (let i = 0; i < count; i++) {
          floaters.push({
            x: Math.random() * (w * anchors.foliageZone.width),
            y: Math.random() * (h * 0.6),
            vx: 0.8 + Math.random() * 1.5,
            vy: 0.6 + Math.random() * 1.2,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.08,
            size: vfx.leavesType === 'sakura' ? 5 + Math.random() * 4 : 7 + Math.random() * 5,
            color: colors[Math.floor(Math.random() * colors.length)]!,
            type: vfx.leavesType === 'sakura' ? 'sakura' : 'leaf',
          });
        }
      }

      // Fireflies
      if (vfx.fireflies > 0) {
        const count = Math.floor((vfx.fireflies / 100) * 30);
        for (let i = 0; i < count; i++) {
          floaters.push({
            x: Math.random() * w,
            y: h * 0.5 + Math.random() * (h * 0.45),
            vx: (Math.random() - 0.5) * 0.8,
            vy: -0.3 - Math.random() * 0.5,
            rot: 0,
            vRot: 0,
            size: 3 + Math.random() * 2,
            color: '#bef264',
            type: 'firefly',
            phase: Math.random() * Math.PI * 2,
          });
        }
      }

      // Embers
      if (vfx.embers > 0) {
        const count = Math.floor((vfx.embers / 100) * 35);
        for (let i = 0; i < count; i++) {
          floaters.push({
            x: Math.random() * w,
            y: h * 0.7 + Math.random() * (h * 0.3),
            vx: (Math.random() - 0.5) * 1.2,
            vy: -1.0 - Math.random() * 1.8,
            rot: 0,
            vRot: 0,
            size: 2 + Math.random() * 3,
            color: '#fb923c',
            type: 'ember',
          });
        }
      }

      // Snow
      if (vfx.snow > 0) {
        const count = Math.floor((vfx.snow / 100) * 60) + 15;
        for (let i = 0; i < count; i++) {
          floaters.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.6,
            vy: 0.8 + Math.random() * 1.2,
            rot: 0,
            vRot: 0,
            size: 2.5 + Math.random() * 3.5,
            color: '#f8fafc',
            type: 'snow',
          });
        }
      }

      floatingParticlesRef.current = floaters;

      // Clouds
      const clouds: CloudPuff[] = [];
      const cloudPuffs = Math.floor((vfx.cloudCoverage / 100) * 5) + 2;
      for (let i = 0; i < cloudPuffs; i++) {
        clouds.push({
          x: w * (0.15 + i * 0.2),
          y: h * (0.10 + Math.random() * 0.16),
          radiusX: 90 + Math.random() * 80,
          radiusY: 45 + Math.random() * 35,
          speed: (0.3 + Math.random() * 0.4) * (vfx.cloudSpeed || 1),
          opacity: 0.25 + Math.random() * 0.25,
        });
      }
      cloudsRef.current = clouds;
    }, [vfx, anchors]);

    // Canvas render loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let targetW = 720;
      let targetH = 1280;
      if (aspectRatio === '16:9') {
        targetW = 1280;
        targetH = 720;
      } else if (aspectRatio === '1:1') {
        targetW = 800;
        targetH = 800;
      } else if (aspectRatio === '4:5') {
        targetW = 800;
        targetH = 1000;
      } else if (aspectRatio === '3:4') {
        targetW = 750;
        targetH = 1000;
      } else if (aspectRatio === '2:3') {
        targetW = 800;
        targetH = 1200;
      } else if (aspectRatio === '2.39:1') {
        targetW = 1280;
        targetH = 536;
      } else if (aspectRatio === '21:9') {
        targetW = 1280;
        targetH = 548;
      }

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        initParticles(targetW, targetH);
      }

      const isHeadless =
        typeof navigator !== 'undefined' &&
        (/HeadlessChrome/i.test(navigator.userAgent) || navigator.webdriver);

      let running = true;
      lastTimeRef.current = performance.now();

      const render = (time: number) => {
        if (!running) return;

        const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
        lastTimeRef.current = time;

        if (isPlaying) {
          elapsedSecRef.current += dt;
        }
        const t = elapsedSecRef.current;

        const w = canvas.width;
        const h = canvas.height;

        ctx.save();
        ctx.clearRect(0, 0, w, h);

        // 1. Camera Transform (Ken Burns, breathing, shake)
        const cam = calculateCameraTransform(
          t,
          vfx.cameraMotion,
          vfx.cameraSpeed,
          vfx.shakeIntensity
        );
        ctx.translate(w / 2, h / 2);
        ctx.scale(cam.scale, cam.scale);
        ctx.rotate((cam.rotateDeg * Math.PI) / 180);
        ctx.translate(-w / 2 + cam.translateX, -h / 2 + cam.translateY);

        // 2. Draw Image or Procedural Fallback
        if (imgRef.current && imgLoaded) {
          const img = imgRef.current;
          const { sx, sy, sWidth, sHeight } = calculateImageCropBounds(
            img.naturalWidth || img.width,
            img.naturalHeight || img.height,
            vfx.autoCropPhoneBezel
          );

          const imgAspect = sWidth / sHeight;
          const canvasAspect = w / h;
          let dw = w;
          let dh = h;
          let dx = 0;
          let dy = 0;

          if (imgAspect > canvasAspect) {
            dw = h * imgAspect;
            dx = (w - dw) / 2;
          } else {
            dh = w / imgAspect;
            dy = (h - dh) / 2;
          }

          ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dw, dh);
        } else {
          // Never blank: draw rich procedural anime scene
          drawProceduralFallbackScene(ctx, w, h, t);
        }

        // 3. Stars & Shooting Stars
        if (vfx.stars > 0) {
          ctx.save();
          const starCount = Math.floor((vfx.stars / 100) * 45);
          for (let i = 0; i < starCount; i++) {
            const sx = (Math.sin(i * 123.45) * 0.5 + 0.5) * w;
            const sy = (Math.cos(i * 678.9) * 0.5 + 0.5) * (h * 0.45);
            const twinkle = 0.4 + Math.sin(t * 3 + i) * 0.3;
            ctx.fillStyle = `rgba(240, 248, 255, ${twinkle})`;
            ctx.beginPath();
            ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // 4. Moon & Clouds
        if (vfx.moonGlow) {
          const moonX = w * 0.60;
          const moonY = h * 0.18;
          const moonPulse = 0.85 + Math.sin(t * 1.2) * 0.15;

          const moonGrad = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 140);
          moonGrad.addColorStop(0, `rgba(240, 248, 255, ${0.45 * moonPulse})`);
          moonGrad.addColorStop(0.4, `rgba(200, 225, 255, ${0.18 * moonPulse})`);
          moonGrad.addColorStop(1, 'rgba(200, 225, 255, 0)');

          ctx.fillStyle = moonGrad;
          ctx.beginPath();
          ctx.arc(moonX, moonY, 140, 0, Math.PI * 2);
          ctx.fill();
        }

        // Drifting Clouds
        if (vfx.driftingClouds && vfx.cloudCoverage > 0) {
          ctx.fillStyle = 'rgba(15, 25, 30, 0.22)';
          cloudsRef.current.forEach((c) => {
            if (isPlaying) {
              c.x += c.speed * dt * 25 * (vfx.windSpeed > 0 ? 1 : -0.5);
              if (c.x - c.radiusX > w) {
                c.x = -c.radiusX;
              }
            }
            ctx.beginPath();
            ctx.ellipse(c.x, c.y, c.radiusX, c.radiusY, 0, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // 5. Light Anchors & Volumetric Headlight Flare
        anchors.lights.forEach((light) => {
          const lightX = w * light.x;
          const lightY = h * light.y;
          const intensity = (light.intensity / 100);
          const [lr, lg, lb] = kelvinToRgb(light.colorTempKelvin);

          // Flicker
          let flicker = 1.0;
          if (light.flicker === 'vintage') {
            flicker = 0.95 + Math.sin(t * (light.flickerRate || 18)) * 0.03 + (Math.random() - 0.5) * 0.02;
          } else if (light.flicker === 'neon') {
            flicker = Math.sin(t * 40) > 0.85 ? 0.75 : 1.0;
          } else if (light.flicker === 'candle') {
            flicker = 0.9 + Math.sin(t * 8) * 0.08 + Math.cos(t * 13) * 0.05;
          }

          // Volumetric cone
          const coneLength = 320;
          const angleRad = (light.coneAngle * Math.PI) / 180;
          const coneGrad = ctx.createRadialGradient(lightX, lightY, 15, lightX - 120, lightY + 180, coneLength);
          coneGrad.addColorStop(0, `rgba(${Math.round(lr * 255)}, ${Math.round(lg * 255)}, ${Math.round(lb * 255)}, ${0.35 * intensity * flicker})`);
          coneGrad.addColorStop(0.5, `rgba(${Math.round(lr * 255)}, ${Math.round(lg * 255)}, ${Math.round(lb * 255)}, ${0.12 * intensity * flicker})`);
          coneGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = coneGrad;
          ctx.beginPath();
          ctx.moveTo(lightX, lightY);
          ctx.lineTo(lightX - 220, lightY + 220);
          ctx.lineTo(lightX + 40, lightY + 260);
          ctx.closePath();
          ctx.fill();

          // Bulb flare
          const flareGrad = ctx.createRadialGradient(lightX, lightY, 2, lightX, lightY, 45);
          flareGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * intensity})`);
          flareGrad.addColorStop(0.25, `rgba(${Math.round(lr * 255)}, ${Math.round(lg * 255)}, ${Math.round(lb * 255)}, ${0.75 * intensity * flicker})`);
          flareGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = flareGrad;
          ctx.beginPath();
          ctx.arc(lightX, lightY, 45, 0, Math.PI * 2);
          ctx.fill();

          // Anamorphic lens streak
          const streakGrad = ctx.createLinearGradient(lightX - 90, lightY, lightX + 90, lightY);
          streakGrad.addColorStop(0, 'rgba(220, 240, 255, 0)');
          streakGrad.addColorStop(0.5, `rgba(${Math.round(lr * 255)}, ${Math.round(lg * 255)}, ${Math.round(lb * 255)}, ${0.6 * intensity * flicker})`);
          streakGrad.addColorStop(1, 'rgba(220, 240, 255, 0)');
          ctx.fillStyle = streakGrad;
          ctx.fillRect(lightX - 90, lightY - 1.5, 180, 3);

          // 6. Wet-Road Reflections
          if (vfx.wetness > 0) {
            const groundY = h * anchors.groundPlaneY;
            const refH = 60 * (vfx.wetness / 100);
            const refGrad = ctx.createLinearGradient(0, groundY, 0, groundY + refH);
            refGrad.addColorStop(0, `rgba(${Math.round(lr * 255)}, ${Math.round(lg * 255)}, ${Math.round(lb * 255)}, ${0.25 * (vfx.wetness / 100) * flicker})`);
            refGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = refGrad;
            ctx.fillRect(lightX - 35, groundY, 70, refH);
          }
        });

        // 7. Puddle Ripples
        if (vfx.puddleRipples) {
          ctx.save();
          ripplesRef.current.forEach((r, idx) => {
            const { radius, alpha, isAlive } = updateRipple(r.radius, r.maxRadius, r.speed * (isPlaying ? 1 : 0));
            r.radius = radius;
            if (isAlive) {
              ctx.strokeStyle = `rgba(210, 235, 255, ${alpha * 0.45})`;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.ellipse(r.x, r.y, r.radius * 1.8, r.radius * 0.55, 0, 0, Math.PI * 2);
              ctx.stroke();
            } else {
              ripplesRef.current.splice(idx, 1);
            }
          });
          ctx.restore();
        }

        // 8. Rain Particles
        if (vfx.rainIntensity > 0) {
          const rainAngleRad = (vfx.rainAngle * Math.PI) / 180;
          const sinA = Math.sin(rainAngleRad);
          const cosA = Math.cos(rainAngleRad);

          ctx.lineWidth = 1.2;
          rainParticlesRef.current.forEach((p) => {
            if (isPlaying) {
              const res = updateRaindrop(p.x, p.y, p.speed, vfx.windSpeed, w, h);
              p.x = res.x;
              p.y = res.y;

              if (res.hitGround && vfx.puddleRipples && Math.random() < 0.25) {
                const puddleMinY = h * anchors.puddleZone.y;
                const groundY = puddleMinY + Math.random() * (h * anchors.puddleZone.height);
                ripplesRef.current.push({
                  x: p.x,
                  y: groundY,
                  radius: 2,
                  maxRadius: 18 + Math.random() * 24,
                  speed: 0.6 + Math.random() * 0.5,
                });
              }
            }

            const alpha = p.layer === 2 ? 0.6 : p.layer === 1 ? 0.4 : 0.22;
            ctx.strokeStyle = `rgba(220, 240, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + sinA * p.length, p.y + cosA * p.length);
            ctx.stroke();
          });
        }

        // 9. Floating Particles (Leaves, Sakura, Embers, Fireflies, Snow)
        floatingParticlesRef.current.forEach((l) => {
          if (isPlaying) {
            l.x += (l.vx + vfx.windSpeed * 0.05) * dt * 25;
            l.y += l.vy * dt * 25;
            l.rot += l.vRot;
            if (l.type === 'firefly' && l.phase !== undefined) {
              l.phase += dt * 3;
            }

            if (l.y > h || l.x > w || l.y < -20 || l.x < -20) {
              l.x = Math.random() * w;
              l.y = l.vy < 0 ? h + 10 : -10;
            }
          }

          ctx.save();
          ctx.translate(l.x, l.y);
          if (l.rot !== 0) ctx.rotate(l.rot);

          if (l.type === 'firefly' && l.phase !== undefined) {
            const glow = 0.5 + Math.sin(l.phase) * 0.45;
            ctx.fillStyle = `rgba(190, 242, 100, ${glow})`;
            ctx.beginPath();
            ctx.arc(0, 0, l.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (l.type === 'snow') {
            ctx.fillStyle = l.color;
            ctx.beginPath();
            ctx.arc(0, 0, l.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = l.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, l.size, l.size * 0.55, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });

        // 10. Fog & Ground Mist
        if (vfx.fogDensity > 0) {
          const mistY = h * anchors.horizonY;
          const mistGrad = ctx.createLinearGradient(0, mistY, 0, h);
          const mistAlpha = (vfx.fogDensity / 100) * (0.2 + Math.sin(t * 0.5) * 0.05);
          mistGrad.addColorStop(0, 'rgba(180, 210, 220, 0)');
          mistGrad.addColorStop(0.5, `rgba(180, 210, 220, ${mistAlpha})`);
          mistGrad.addColorStop(1, `rgba(140, 180, 190, ${mistAlpha * 0.7})`);
          ctx.fillStyle = mistGrad;
          ctx.fillRect(0, mistY, w, h - mistY);
        }

        // 11. Lightning & Flash Guard (WCAG 2.3.1)
        if (vfx.lightningEnabled && isPlaying) {
          if (t >= nextThunderTimeRef.current) {
            const canFlash = flashGuardRef.current.canFlash(t, vfx.photosensitiveSafeMode);
            if (canFlash) {
              flashOpacityRef.current = vfx.photosensitiveSafeMode ? 0.4 : 0.75;
              soundscape.triggerThunder(vfx.lightningDistanceKm);
              if (onThunderFlash) onThunderFlash();
            }
            const interval = Math.max(5, 60 / Math.max(0.2, vfx.lightningFrequency));
            nextThunderTimeRef.current = t + interval + Math.random() * 4;
          }
        }

        if (flashOpacityRef.current > 0.01) {
          ctx.fillStyle = `rgba(235, 245, 255, ${flashOpacityRef.current})`;
          ctx.fillRect(0, 0, w, h);
          flashOpacityRef.current *= vfx.photosensitiveSafeMode ? 0.94 : 0.88;
        }

        // 12. Post-processing Color Grading & Scanlines
        if (vfx.colorFilter !== 'none') {
          ctx.save();
          switch (vfx.colorFilter) {
            case 'midnight-lofi':
              ctx.fillStyle = 'rgba(12, 28, 48, 0.18)';
              ctx.globalCompositeOperation = 'multiply';
              ctx.fillRect(0, 0, w, h);
              ctx.fillStyle = 'rgba(100, 180, 255, 0.06)';
              ctx.globalCompositeOperation = 'screen';
              ctx.fillRect(0, 0, w, h);
              break;
            case 'golden-hour':
              ctx.fillStyle = 'rgba(255, 140, 40, 0.18)';
              ctx.globalCompositeOperation = 'color-burn';
              ctx.fillRect(0, 0, w, h);
              ctx.fillStyle = 'rgba(255, 200, 100, 0.15)';
              ctx.globalCompositeOperation = 'screen';
              ctx.fillRect(0, 0, w, h);
              break;
            case 'neon-night':
              ctx.fillStyle = 'rgba(255, 0, 128, 0.12)';
              ctx.globalCompositeOperation = 'color-dodge';
              ctx.fillRect(0, 0, w, h);
              ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
              ctx.globalCompositeOperation = 'screen';
              ctx.fillRect(0, 0, w, h);
              break;
            case 'film-noir':
              ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
              ctx.globalCompositeOperation = 'saturation';
              ctx.fillRect(0, 0, w, h);
              break;
            case 'retro-tape':
              ctx.fillStyle = 'rgba(255, 230, 200, 0.05)';
              ctx.fillRect(0, 0, w, h);
              break;
          }
          ctx.restore();
        }

        // Scanlines (Retro Tape)
        if (vfx.scanlines > 0) {
          ctx.fillStyle = `rgba(0, 0, 0, ${(vfx.scanlines / 100) * 0.14})`;
          for (let lineY = 0; lineY < h; lineY += 4) {
            ctx.fillRect(0, lineY, w, 1.5);
          }
        }

        // Vignette
        if (vfx.vignette > 0) {
          const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.75);
          const vigStrength = (vfx.vignette / 100) * 0.7;
          vig.addColorStop(0, 'rgba(0,0,0,0)');
          vig.addColorStop(1, `rgba(0,0,0,${vigStrength})`);
          ctx.fillStyle = vig;
          ctx.fillRect(0, 0, w, h);
        }

        // 13. Anamorphic Letterbox 2.39:1
        if (vfx.letterbox239) {
          const barH = h * 0.11;
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, w, barH);
          ctx.fillRect(0, h - barH, w, barH);
        }

        ctx.restore();

        if (isHeadless) {
          setTimeout(() => {
            if (running) animIdRef.current = requestAnimationFrame(render);
          }, 65);
        } else {
          animIdRef.current = requestAnimationFrame(render);
        }
      };

      animIdRef.current = requestAnimationFrame(render);

      return () => {
        running = false;
        if (animIdRef.current) {
          cancelAnimationFrame(animIdRef.current);
        }
      };
    }, [vfx, anchors, aspectRatio, imgLoaded, isPlaying, initParticles, onThunderFlash]);

    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black select-none">
        <canvas
          ref={canvasRef}
          data-testid="video-canvas"
          className="max-h-full max-w-full object-contain shadow-2xl transition-all duration-300"
          style={{
            aspectRatio:
              aspectRatio === '9:16'
                ? '9/16'
                : aspectRatio === '16:9'
                  ? '16/9'
                  : aspectRatio === '1:1'
                    ? '1/1'
                    : aspectRatio === '4:5'
                      ? '4/5'
                      : aspectRatio === '3:4'
                        ? '3/4'
                        : aspectRatio === '2:3'
                          ? '2/3'
                          : aspectRatio === '2.39:1'
                            ? '2.39/1'
                            : '21/9',
          }}
        />
      </div>
    );
  }
);

VideoCanvas.displayName = 'VideoCanvas';
