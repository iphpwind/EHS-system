<script setup>
const props = defineProps({
  themeColor: { type: String, default: '#1a56db' }
});

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lighten(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

const lightColor = computed(() => hexToRgba(lighten(props.themeColor, 40), 0.25));
const midColor = computed(() => hexToRgba(props.themeColor, 0.55));
const darkColor = computed(() => hexToRgba(props.themeColor, 0.85));
</script>

<template>
  <div class="wave-bg-container">
    <!-- 右上大圆 -->
    <div class="wave-circle wave-circle-top">
      <svg height="1337" width="1337" viewBox="0 0 1337 1337">
        <defs>
          <path
            id="path-1"
            opacity="1"
            fill-rule="evenodd"
            d="M1337,668.5 C1337,1037.455193874239 1037.455193874239,1337 668.5,1337 C523.6725684305388,1337 337,1236 370.50000000000006,1094 C434.03835568300906,824.6732385973953 6.906089672974592e-14,892.6277623047779 0,668.5000000000001 C0,299.5448061257611 299.5448061257609,1.1368683772161603e-13 668.4999999999999,0 C1037.455193874239,0 1337,299.544806125761 1337,668.5Z"
          />
          <linearGradient id="linearGradient-2" x1="0.79" y1="0.62" x2="0.21" y2="0.86">
            <stop offset="0" :stop-color="lightColor" stop-opacity="1" />
            <stop offset="0.5" :stop-color="midColor" stop-opacity="1" />
            <stop offset="1" :stop-color="darkColor" stop-opacity="1" />
          </linearGradient>
        </defs>
        <g opacity="1">
          <use xlink:href="#path-1" fill="url(#linearGradient-2)" fill-opacity="1" />
        </g>
      </svg>
    </div>
    <!-- 左下小圆 -->
    <div class="wave-circle wave-circle-bottom">
      <svg height="896" width="968" viewBox="0 0 968 896">
        <defs>
          <path
            id="path-2"
            opacity="1"
            fill-rule="evenodd"
            d="M896,448 C1142.6325445712241,465.5747656464056 695.2579309733121,896 448,896 C200.74206902668806,896 5.684341886080802e-14,695.2579309733121 0,448.0000000000001 C0,200.74206902668806 200.74206902668791,5.684341886080802e-14 447.99999999999994,0 C695.2579309733121,0 475,418 896,448Z"
          />
          <linearGradient id="linearGradient-3" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0" :stop-color="darkColor" stop-opacity="1" />
            <stop offset="0.6" :stop-color="midColor" stop-opacity="1" />
            <stop offset="1" :stop-color="lightColor" stop-opacity="1" />
          </linearGradient>
        </defs>
        <g opacity="1">
          <use xlink:href="#path-2" fill="url(#linearGradient-3)" fill-opacity="1" />
        </g>
      </svg>
    </div>
    <!-- 装饰小圆点 -->
    <div class="decor-dot dot-1"></div>
    <div class="decor-dot dot-2"></div>
    <div class="decor-dot dot-3"></div>
  </div>
</template>

<style scoped>
.wave-bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.wave-circle {
  position: absolute;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.wave-circle-top {
  right: -300px;
  top: -900px;
  animation: floatTop 8s ease-in-out infinite alternate;
}

.wave-circle-bottom {
  bottom: -400px;
  left: -200px;
  animation: floatBottom 10s ease-in-out infinite alternate;
}

@keyframes floatTop {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(-30px) rotate(2deg); }
}

@keyframes floatBottom {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(20px) rotate(-2deg); }
}

.decor-dot {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  animation: pulse 4s ease-in-out infinite;
}

.dot-1 {
  width: 120px;
  height: 120px;
  background: v-bind(themeColor);
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.dot-2 {
  width: 80px;
  height: 80px;
  background: v-bind(themeColor);
  bottom: 20%;
  right: 12%;
  animation-delay: 1.5s;
}

.dot-3 {
  width: 40px;
  height: 40px;
  background: v-bind(themeColor);
  top: 60%;
  left: 20%;
  animation-delay: 3s;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.12; }
  50% { transform: scale(1.15); opacity: 0.2; }
}

@media (max-width: 768px) {
  .wave-circle-top {
    right: -100px;
    top: -600px;
    transform: scale(0.6);
  }
  .wave-circle-bottom {
    bottom: -300px;
    left: -100px;
    transform: scale(0.6);
  }
  .decor-dot {
    display: none;
  }
}
</style>
